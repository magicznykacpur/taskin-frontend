import { useCookies } from "react-cookie";

const useTokens = (): [string, string, (name: string, value?: any, options?: any | undefined) => void] => {
  const [cookies, removeCookie] = useCookies();

  return [cookies["jwt_token"], cookies["refresh_token"], removeCookie];
};

export default useTokens;
