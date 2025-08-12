import classes from './polygonList.module.scss';
import DeleteItemIcon from './assets/icons/delete_30.svg?react';
import { memo } from 'react';
import type { FC } from 'react';
import type { IPolygon } from '../../types/global.types';

interface IPolygonListProps {
  polygons: IPolygon[];
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  selectedPolygonId: string | null;
}

const PolygonList: FC<IPolygonListProps> = ({
  polygons,
  onDelete,
  onSelect,
  selectedPolygonId,
}) => {
  return (
    <div className={classes.polygonList}>
      <ul>
        <li className={classes.polygonListHeader}>
          <span className={classes.headerName}>Name</span>
          <span className={classes.headerId}>ID</span>
        </li>
        <hr></hr>
        {polygons.map((polygon) => {
          const currentId = String(polygon.id);

          return (
            <li
              key={currentId}
              onClick={() => onSelect(currentId)}
              className={selectedPolygonId === currentId ? 'selected' : ''}
            >
              <span className={classes.polygonDescription}>
                <span className={classes.polygonName}>{polygon.name}</span>
                <span className={classes.polygonId}>{polygon.id}</span>
              </span>
              <>
                <DeleteItemIcon
                  className={classes.listItemButton}
                  onClick={() => onDelete(currentId)}
                  width={20}
                ></DeleteItemIcon>
              </>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(PolygonList);
