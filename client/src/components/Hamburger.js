import React from 'react';
import * as Icons from 'react-feather';
import AuthButton from './AuthButton';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './Hamburger.scss';
import { Link } from 'react-router-dom';

const menus = (isAuthenticated) => {
    if (!isAuthenticated) {
        return { HOME: { icon: <Icons.Home />, title: 'Home', link: '/' } };
    }

    return {
        HOME: { icon: <Icons.Home />, title: 'Home', link: '/' },
        DONATION: {
            icon: <Icons.Plus />,
            title: 'My Donations',
            link: '/my-donations'
        },

        CONTRIBUTION: {
            icon: <Icons.Smile />,
            title: 'My Fundraisers',
            link: '/my-fundraisers'
        },
        FAVORITE: {
            icon: <Icons.Star />,
            title: 'My Favorites',
            link: '/my-favorites'
        },

        PROFILE: {
            icon: <Icons.Headphones />,
            title: 'My Profile',
            link: '/my-profile'
        }
    };
};
const Hamburger = ({ isAuthenticated, history, setHamBurger, logout }) => {
    const list = menus(isAuthenticated);

    const active = useLocation().pathname;

    return (
        <motion.div
            animate={{ x: 0 }}
            initial={{ x: '-100%' }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className='hamburger-container'
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <div className='hamburger-menu'>
                <div
                    className='hamburger-cross'
                    onClick={() => {
                        setHamBurger(false);
                    }}
                >
                    <Icons.X />
                </div>
                <motion.div
                    animate={{ y: 0 }}
                    initial={{ y: -2000 }}
                    transition={{ duration: 0.4 }}
                    exit={{ y: -2000 }}
                    className='hamburger-top'
                >
                    <div className='img-wrapper'>
                        <img src='../logo.png' />
                    </div>
                </motion.div>
                <motion.div
                    animate={{ y: 0 }}
                    initial={{ y: 2000 }}
                    exit={{ y: 2000 }}
                    transition={{ duration: 0.5 }}
                    className='hamburger-items'
                >
                    {Object.keys(list).map((key) => {
                        const { title, icon, link } = list[key];
                        return (
                            <div
                                key={link}
                                onClick={() => {
                                    setHamBurger(false);
                                    // setactive(link);
                                }}
                                className={`hamburger-item ${active === link ? 'active' : ''}`}
                            >
                                <Link to={link}>
                                    {icon}
                                    <span>{title}</span>
                                </Link>
                            </div>
                        );
                    })}

                    <div className='authentication-status'>
                        <AuthButton
                            onClick={() => {
                                if (isAuthenticated) logout();
                                setHamBurger(false);
                                history.push('/login');
                            }}
                        >
                            {isAuthenticated ? 'Logout' : 'Log In/ Signup'}
                        </AuthButton>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Hamburger;
