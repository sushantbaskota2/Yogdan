import React from "react";
import ContentLoader from "react-content-loader";
const ContentLoaderP = () => {
  return (
    <React.Fragment>
      {Array.from({ length: 3 }).map(() => (
        <ContentLoader
          height={100}
          speed={1}
          key={Math.random()}
          backgroundColor={"#fff"}
          foregroundColor={"#ccc"}
          viewBox="0 0 380 70"
          style={{ width: "100%" }}
        >
          {/* Only SVG shapes */}

          <rect x="0" y="0" rx="10" ry="10" width="100%" height="65" />
        </ContentLoader>
      ))}
    </React.Fragment>
  );
};

export const ContentLoaderHome = () => {
    return (
        <>
        <div>
            <ContentLoader viewBox='0 0 400 475' height={400} style={{ marginTop: '8rem',height:'100%' }}>
                <circle cx='50' cy='308' r='30' />
                <rect x='125' y='283' rx='4' ry='4' width='100' height='13' />
                <rect x='125' y='310' rx='4' ry='4' width='50' height='8' />
                <rect x='25' y='2' rx='5' ry='5' width='60%' height='10' />
                <rect x='25' y='0' rx='5' ry='5' width='60%' height='250' />

            
            </ContentLoader>
            
        </div>
         <div style={{margin:0, padding:0}}>
            <ContentLoader viewBox='0 0 400 475' height={400} style={{ marginTop: '8rem',height:'100%'  }}>
                <circle cx='50' cy='308' r='30' />
                <rect x='125' y='283' rx='4' ry='4' width='100' height='13' />
                <rect x='125' y='310' rx='4' ry='4' width='50' height='8' />
                <rect x='25' y='2' rx='5' ry='5' width='60%' height='10' />
                <rect x='25' y='0' rx='5' ry='5' width='60%' height='250' />

            
            </ContentLoader>
        </div>
             
         </>
    );
};

export default ContentLoaderP;
