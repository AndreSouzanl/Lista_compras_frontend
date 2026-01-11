
import estilos from "./Footer.module.css"
export default function Footer(props){

  return(
    <footer className={estilos.container_footer}>
      <span>{props.descricao}</span>
      <span>{props.subtitulo}</span>
    </footer>
  )

}