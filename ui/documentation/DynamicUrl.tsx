import * as styles from "./DynamicUrl.css";

type Entity = {
  id: string;
  label: string;
};

type Props = {
  title: string;
  path: string;
  availableEntities: Array<Entity>;
  selectedEntity: Entity | null;
  onSelectEntity: (entityId: string) => void;
};

const DynamicUrl = ({
  title,
  path,
  availableEntities,
  selectedEntity,
  onSelectEntity,
}: Props) => (
  <div className={styles.dynamicUrl}>
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      {availableEntities.length === 1 && selectedEntity && (
        <div className={styles.soleGroup}>{selectedEntity.label}</div>
      )}
      {availableEntities.length > 1 && (
        <select
          className={styles.select}
          onChange={(event) => onSelectEntity(event.target.value)}
        >
          {availableEntities.map(({ label, id }) => (
            <option className={styles.option} key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      )}
    </div>
    <pre className={styles.url}>
      {typeof window !== "undefined" &&
        `${window.location.protocol}//${window.location.host}${path.replace(
          ":id",
          selectedEntity ? selectedEntity.id : ":id"
        )}`}
    </pre>
  </div>
);

export default DynamicUrl;
