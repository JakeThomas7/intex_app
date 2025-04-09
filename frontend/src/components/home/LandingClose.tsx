import styled from 'styled-components';
import Carousel from '../shop/Carousel'; // Your Carousel component

// Styled components
const LandingCloseContainer = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: black; /* Set the background to black */
`;

const CarouselBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Place the carousel in the background */
  opacity: 0.5; /* Darken the background */
`;

// const OverlayContent = styled.div`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   text-align: center;
//   color: white;
//   z-index: 1;
// `;

const LandingClose = ({ carouselData }: { carouselData: Array<any> }) => {
  return (
    <LandingCloseContainer>
      {/* Background Carousels */}
      <CarouselBackground>
        {/* Three background carousels with different data sets */}
        <Carousel
          title="Featured Shows"
          cardWidth={22}
          cardHeight={36}
          data={carouselData}
        />
        <Carousel
          title="Trending Now"
          cardWidth={22}
          cardHeight={36}
          data={carouselData}
        />
        <Carousel
          title="New Releases"
          cardWidth={22}
          cardHeight={36}
          data={carouselData}
        />
      </CarouselBackground>
    </LandingCloseContainer>
  );
};

export default LandingClose;
