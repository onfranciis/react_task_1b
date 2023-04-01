import React, { useReducer } from "react";
import MkdSDK from "./utils/MkdSDK";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem("token"),
  role: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      //TODO
      const { error, expire_at, role, token, two_factor_enabled, user_id } =
        action.payload;
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      return {
        ...state,
        isAuthenticated: !error,
        user: user_id,
        token: token,
        role: role,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

let sdk = new MkdSDK();

export const tokenExpireError = (dispatch, errorMessage) => {
  const role = localStorage.getItem("role");
  if (errorMessage === "TOKEN_EXPIRED") {
    dispatch({
      type: "Logout",
    });
    window.location.href = "/" + role + "/login";
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    //TODO

    const sdkCheck = async () => {
      const role = localStorage.getItem("role") ?? "admin";
      const code = await sdk.check(localStorage.getItem("role"));
      if (code !== 200) {
        // dispatch({ type: "LOGOUT" });
      } else {
        dispatch({
          type: "LOGIN",
          payload: {
            role: localStorage.getItem("role"),
            user_id: localStorage.getItem("user_id"),
            token: localStorage.getItem("token"),
          },
        });
      }
    };

    sdkCheck();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
