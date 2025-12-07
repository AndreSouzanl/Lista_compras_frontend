import estilos from "./Header.module.css";
export default function Header(props) {
  return (
    <header className={estilos.container_header}>
      <div>
        <h1>{props.titulo}</h1>
      </div>
    </header>
  );
}
