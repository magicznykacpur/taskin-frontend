import { useCookies } from "react-cookie";

const useTokens = (): [string, string] => {
  const [cookies] = useCookies();

  return [cookies["jwt_token"], cookies["refresh_token"]];
};

export default useTokens;
