import styles from "../styles";

const SidebarToggle = ({ onClick, open }) => (
  <button style={styles.sidebarToggle} onClick={onClick}>
    {open ? "‹" : "›"}
  </button>
);

export default SidebarToggle;