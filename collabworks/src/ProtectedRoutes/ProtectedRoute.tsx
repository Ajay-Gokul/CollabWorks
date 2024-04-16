import { Navigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
interface ProtectedRoutesProps {
  children: any;
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const { addToast } = useToasts();
  const isTokenPresent = localStorage.getItem("Token") != null;
  return (
    <div>
      {!isTokenPresent ? (
        <div>
          <Navigate to="/" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ProtectedRoutes;
