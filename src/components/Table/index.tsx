// react libraries
import * as React from 'react';

// styles
import './Table.scss';

// interfaces
import { TableProps } from './interfaces';

/**
 * Returns Table component for assets
 *
 * @param {TableProps} props
 *
 * @returns {JSX} JSX
 */
const Table = (props: TableProps) => {
  const { keys, values } = props;
  const tableHeaders = Object.keys(keys);
  return (
    <React.Fragment>
      <div className="tbl-header">
        {
          tableHeaders.map((header, index) => {
            return (
              <div key={index} className={keys[header].colWidth
                ? `tbl-header__column--${keys[header].colWidth}`
                : 'tbl-header__column'}
              >
                {
                  keys[header].value || header
                }
              </div>
            );
          })
        }
      </div>
      {
        values.map((value) => {
          return (
            <div className="tbl-columns">
            <div className="tbl-row-number">
              <h5>1</h5>
            </div>
            <div key={value.id} className="tbl-row">
              {
                tableHeaders.map((header, index) => {
                  return (
                    <div key={index} className={keys[header].colWidth
                      ? `tbl-row__column--${keys[header].colWidth}`
                      : 'tbl-row__column'}
                    >
                      {value[keys[header].valueKey]}
                    </div>
                  );
                })
              }
            </div>
            </div>
          );
        })
      }
    </React.Fragment>
  );
};

export default Table;
