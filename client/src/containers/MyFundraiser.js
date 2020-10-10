import React, { useState, useEffect } from 'react';
import HamburgerButton from '../components/HamburgerButton';
import moment from 'moment';
import Slider from '../components/Slider';
import axios from '../axios';

import ContentLoaderP from '../components/ContentLoader';
const MyFundraiser = ({ hamburger, setHamBurger, history }) => {
    const [ fundraisers, setFundraisers ] = useState([]);
    const [ loading, setloading ] = useState(true);

    useEffect(() => {
        let mounted = true;
        try {
            axios.get('/causes/me').then(({ data }) => {
                if (mounted) {
                    setFundraisers(data);
                    setloading(false);
                }
            });
        } catch (error) {
            if (mounted) {
                setloading(false);
            }
        }

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className='MyFundraisers' onClick={hamburger ? () => setHamBurger(false) : () => {}}>
            <HamburgerButton setHamBurger={setHamBurger} title='My Fundraisers' />

            <div className='title'>
                <span>Fundraisers</span>
            </div>

            {loading ? (
                <ContentLoaderP />
            ) : (
                <div className='fund-cards'>
                    {fundraisers.map(({ endDate, title, images, donations, goal, _id }) => {
                        return (
                            <FundCard
                                key={_id}
                                endDate={endDate}
                                title={title}
                                src={images.length > 0 ? images[0].image : ''}
                                raised={donations.length === 0 ? 0 : donations.reduce((a, c) => a + c.amount, 0)}
                                goal={goal}
                                i={_id}
                                history={history}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const FundCard = ({ title, endDate, history, src, raised, goal, i }) => (
    <div
        key={i}
        className='fund-card'
        onClick={() => {
            history.push(`/campaign/${i}`);
        }}
    >
        <div className='left'>
            <img src={`http://localhost:8000${src}`} />
        </div>
        <div className='middle'>
            <span>{title}</span>

            {<Slider raised={raised} goal={goal} />}
            <div className='two'>
                <span>{raised}</span>
                <span style={{ color: 'black' }}>of</span>
                <span>{goal}</span>
            </div>
        </div>

        <div className='end'>
            <span>Ends on:</span>
            <span className='end-date'> {moment(endDate).format('MMM D, YYYY')}</span>
        </div>
    </div>
);

export default MyFundraiser;
