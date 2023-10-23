import { isRouteErrorResponse, useAsyncError, useNavigate, useRouteError } from "react-router-dom";
import ErrorPage from "./ErrorPage";


export default function RootBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();
  
    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        return <div>This page doesn't exist!</div>;
      }
  
      if (error.status === 401) {
        return <div>UnAuthorized</div>
      }
  
      if (error.status === 503) {
        return <div>Looks like our API is down</div>;
      }
  
      if (error.status === 418) {
        return <div>🫖</div>;
      }
    }
  
    return <ErrorPage/>;
  }