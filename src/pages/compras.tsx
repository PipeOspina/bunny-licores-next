import { FC } from "react";
import Layout from "components/Layout";
import { useDispatch } from "@hooks/redux";
import { setGlobalCharging } from "@actions/charging";

const Ventas: FC = () => {
    const dispatch = useDispatch();

    return (
        <div onClick={() => dispatch(setGlobalCharging('auth', true))}>Hellowis</div>
    );
}

export default Ventas;
