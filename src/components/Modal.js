import React, { useState } from "react";
import { getMonths, listMonth, projects } from '../helpers/helper';

function Modal({ day }) {
    const [select, setSelect] = useState(new Date(day.getFullYear(), day.getMonth(), 1).getTime());
    const [checkedItems, setCheckedItems] = useState([]);

    const handleCheck = key => {
        setCheckedItems((checkedItems) => {
            const findIdx = checkedItems.indexOf(key);
            if (findIdx > -1) {
                checkedItems.splice(findIdx, 1);
            } else {
                checkedItems.push(key);
            }
            return checkedItems
        });
    }
    return (
        <>
            <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch Projects
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" >Projects</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12 my-3">
                                    <select className="form-select" onChange={e => setSelect(e.target.value)} value={select}>
                                        {
                                            getMonths(day.getMonth(), day.getFullYear()).map((current, index) => {
                                                return <option key={index} value={current.getTime()}>{`${listMonth[current.getMonth()]} ${current.getFullYear()}`}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                {
                                    projects.map((proj, index) => {
                                        return <div className="col-3" key={index}>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id={proj.key} onChange={() => handleCheck(proj.key)} selected={checkedItems.includes(proj.key)} />
                                                <label className="form-check-label" htmlFor="gridCheck">
                                                    {proj.name}
                                                </label>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-dark">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal;