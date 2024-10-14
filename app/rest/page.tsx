"use client"

import ApiAutomationFlow from "./api-automation-flow";
import ApiCallBuilder from "./api-call-builder";
import ApiCallManagement from "./api-call-management";
import ApiTesterDashboard from "./api-tester-dashboard";
import DynamicApiCallBuilder from "./dynamic-api-call-builder";


export default function PageFlow() {
  
  return (
    <>
      <ApiCallManagement />
      <DynamicApiCallBuilder />
      {/* <br />
      <br />
      <ApiAutomationFlow />
      <br />
      <br />
      <ApiCallBuilder /> */}
    </>
  );
}

//     <div className="min-h-screen bg-background">

//       <DndProvider backend={HTML5Backend}>
//         <FlowDiagram />
//       </DndProvider>
//     </div>
//   )
// }