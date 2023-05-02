import { utils } from '@pulse-tracker/utils';
import { plugin } from '@pulse-tracker/plugin';
import styled from '@emotion/styled';

const StyledPage = styled.div`
  .page {
  }
`;

export function Index() {
  if (typeof window !== 'undefined') {
    const rum = plugin.config({ id: "1", projectId: "miweb", urlEndpoint: "https://localhost/saveMetric" });
    rum.measureFid((fid) => console.log("Mostramos el fid ", fid));
  }
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
