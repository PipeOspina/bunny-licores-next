import { useCharging } from "@hooks/charging";
import { IIndexCharging } from "@interfaces/Charging";
import Title from "components/Title";
import { FC, useEffect } from "react";

const Ventas: FC = () => {
    const { setCharging } = useCharging<IIndexCharging>('index');

    useEffect(() => {
        setCharging('redirect', false);
    }, []);

    return (
        <>
            <Title onClick={() => console.log('jelowis')}>Ventas</Title>
        </>
    );
}

export default Ventas;
