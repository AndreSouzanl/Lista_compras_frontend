import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import estilos from "./Produto.module.css";
export default function Produto(props) {
  return (
    <>
      <tr>
        <td className={props.checado ? `${estilos.riscado}` : ""}>
          {props.nome}
        </td>
        <td className={props.checado ? `${estilos.riscado}` : ""}>
          {props.quantidade}
        </td>
        <td className={props.checado ? `${estilos.riscado}` : ""}>
          {props.descricao}
        </td>
        <td className={props.checado ? `${estilos.riscado}` : ""}>
          {props.unidade}
        </td>

        <td>
          <div className={estilos.acoes}>
            <IconEdit
              className={`${estilos.iconeResponsivo}`}
              stroke={1}
              color="green"
              onClick={() => props.onClickEdit(props.id)}
            />
            <IconTrash
              className={`${estilos.iconeResponsivo} ${
                props.editando ? estilos.desabilitado : ""
              } ${estilos}`}
              stroke={1}
              color="red"
              onClick={() => {
                if (!props.editando) props.onClickDelete(props.id);
              }}
            />
            <IconCheck
              className={estilos.iconeResponsivo}
              stroke={1}
              color="#f39c12"
              onClick={() => props.onClickCheck(props.id)}
            />
          </div>
        </td>
      </tr>
    </>
  );
}


