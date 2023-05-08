import { plugin } from '@pulse-tracker/plugin';
import styled from '@emotion/styled';

const StyledPage = styled.div`
  .page {
  }
`;

export function Index() {
  if (typeof window !== 'undefined') {
    const rum = plugin.config({
      projectId: 'miweb',
      projectName: 'Mi web',
    });

    rum.measureFCP((fcp) => console.log('Mostramos el fcp -->', fcp));
  }
  const title = 'Page tittle';
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
