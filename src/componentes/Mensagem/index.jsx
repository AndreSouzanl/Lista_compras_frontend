import { useEffect, useState } from "react";
import estilos from "./Mensagem.module.css";
export default function Mensagem(props) {
  const [visivel, setVisivel] = useState(false);
  

  useEffect(() => {
    if (props.mensagem.texto) {
      setVisivel(true);
      const timer = setTimeout(() => setVisivel(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [props.mensagem]);

  if (!props.mensagem.texto) return null;
  return (
    <div
      className={`${estilos.container} ${estilos[props.mensagem.tipo]} ${
        !visivel ? `${estilos.escondida}` : ""
      }`}
    >
      <p className={estilos.mensagem}>{props.mensagem.texto}</p>
    </div>
  );
}
