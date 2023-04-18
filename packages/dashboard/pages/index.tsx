import { utils } from '@pulse-tracker/utils';
import styled from '@emotion/styled';

const StyledPage = styled.div`
  .page {
  }
`;

export function Index() {
  const title = utils();
  return (
    <StyledPage>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome {title} 👋
            </h1>
          </div>
        </div>
      </div>
    </StyledPage>
  );
}

export default Index;
