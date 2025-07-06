import {useEffect, useState} from 'react';

import {Cell} from '../Cell/Cell.jsx';
import {Section} from '../Section/Section.jsx';
import {Constraint} from '../Contstraint/Constraint.jsx';
import Modal from '../Modal/Modal.jsx';
import {CELL_SIZE} from "../App.jsx";

//MODES: SETUP, SOLVE
const modes = ['SETUP', 'SOLVE'];

export const Grid = () => {

    const [size, setSize] = useState(11);
    const [mode, setMode] = useState(modes[0]);

    const [cells, setCells] = useState([]);
    const [fixedCells, setFixedCells] = useState([]);
    const [sections, setSections] = useState([
        {
            initialValue: 1,
            color: 'lightblue',
            cells: []
        }
    ]);
    const [currentSettingSection, setCurrentSection] = useState(null);
    const [constraints, setConstraints] = useState([]);

    const [isUploadFixedOpened, setIsUploadFixedOpened] = useState(false);
    const [isUploadConstraintOpened, setIsUploadConstraintOpened] = useState(false);
    const [isUploadSectionOpened, setIsUploadSectionOpened] = useState(false);

    useEffect(() => {

        setCells(generateInitialState(size));
    }, [size]);

    useEffect(() => {

        setConstraints(generateInitialConstraints(size));
    }, [size]);

    useEffect(() => {

        markFixedCells(cells, fixedCells);
    }, [cells, fixedCells]);

    useEffect(() => {

        if (mode === 'SOLVE') {

            let newCells = generateCellsCopy(cells);
            newCells.forEach((row) => row.forEach(cell => recalculateCell(cell, cells)));
            setCells(newCells);
        }
    }, [mode]);

    const onClickFixedHandler = (position) => {

        let newFixedCells = [...fixedCells];

        const fixedIndex = newFixedCells.findIndex((element) => element.x === position.x && element.y === position.y);
        if (fixedIndex !== -1) {
            newFixedCells.splice(fixedIndex, 1);
        } else {

            newFixedCells.push(position);
        }
        setFixedCells(newFixedCells);

        let newCells = generateCellsCopy(cells);
        newCells[position.x][position.y].isFixed = !newCells[position.x][position.y].isFixed;
        setCells(newCells);
    }

    const onClickSectionHandler = (position) => {

        if (currentSettingSection === null) return;

        const newSections = [...sections];
        newSections[currentSettingSection].cells.push(position);
        setSections(newSections);

        let newSectionCells = generateCellsCopy(cells);
        newSectionCells[position.x][position.y].section = sections[currentSettingSection];
        setCells(newSectionCells);

        const newConstraints = [...constraints];

        newConstraints[position.x].correct = null;

        setConstraints(newConstraints);
    }

    const onClickEditCellHandler = (position, newValue) => {

        let newCells = generateCellsCopy(cells);
        let editedCell = newCells[position.x][position.y];
        editedCell.number = newValue;
        editedCell.isBlack = newValue === '-';

        //When value is set to '-', need to set the overflow amount and adjacent cell possible values
        //When value is set to [1-9], need to deduct the taken amount from the overflow of the black square, then update
        //remaining adjacent cells possible values
        editedCell.availableOverflow = newValue === '-' ? editedCell.minimumValue : 0;

        let modifiedPositions = [position];
        if (newValue !== '-' && Number(newValue) > editedCell.minimumValue) {

            const adjacentBlackCells = getAdjacentPositions(position).filter(
                (position) => newCells[position.x][position.y].isBlack
            );

            let difference = Number(newValue) - editedCell.minimumValue;
            adjacentBlackCells.forEach((position) => {

                if (difference === 0) return;

                modifiedPositions.push(position);

                let adjacentBlackCell = newCells[position.x][position.y];
                if (adjacentBlackCell.availableOverflow >= difference) {

                    adjacentBlackCell.availableOverflow -= difference;
                    difference = 0;
                } else {

                    difference -= adjacentBlackCell.availableOverflow;
                    adjacentBlackCell.availableOverflow = 0;
                }
            });

        }

        let cellsToRecalculate = [];

        modifiedPositions.forEach((position) => {
            const neighbours = getBlackAdjacentPositions(position);
            neighbours.forEach((neighbour) => {

                const foundIndex = cellsToRecalculate.findIndex((element) => element.x === neighbour.x && element.y === neighbour.y);
                if (foundIndex === -1) cellsToRecalculate.push(neighbour);
            });
        });

        cellsToRecalculate.forEach((cell) => recalculateCell(newCells[cell.x][cell.y], newCells));

        setCells(newCells);

        const newConstraints = [...constraints];

        newConstraints[position.x].correct = null;

        setConstraints(newConstraints);
    }

    const getAdjacentPositions = (position) => {

        let adjacentCells = [];

        if (position.x - 1 >= 0) adjacentCells.push({x: position.x - 1, y: position.y});
        if (position.x + 1 < size) adjacentCells.push({x: position.x + 1, y: position.y});
        if (position.y - 1 >= 0) adjacentCells.push({x: position.x, y: position.y - 1});
        if (position.y + 1 < size) adjacentCells.push({x: position.x, y: position.y + 1});

        return adjacentCells;
    }

    const getBlackAdjacentPositions = (position) => {

        let invalidBlackCells = getAdjacentPositions(position);

        if (position.y - 2 >= 0) invalidBlackCells.push({x: position.x, y: position.y - 2});
        if (position.y + 2 < size) invalidBlackCells.push({x: position.x, y: position.y + 2});

        return invalidBlackCells;
    }

    const recalculateCell = (cell, cells) => {

        if (cell.isFixed) return;
        console.log(cell);

        const adjacentPositions = getAdjacentPositions({x: cell.x, y: cell.y});
        const adjacentFixedPositions = getBlackAdjacentPositions({x: cell.x, y: cell.y});

        const maximumOverflow = adjacentPositions.reduce(
            (accumulator, position) =>  accumulator + Number(cells[position.x][position.y].availableOverflow),
            0
        );

        let newPossibleValues = generatePossibleValues(cell, maximumOverflow);

        const isBlackable = adjacentFixedPositions.reduce(
            (accumulator, position) => accumulator && !cells[position.x][position.y].isBlack,
            true
        );

        if (isBlackable && cell.y !== 1 && cell.y !== size - 2) newPossibleValues.unshift('-');

        cell.possibleValues = newPossibleValues;
    }

    return (
        <>
            <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                <div style={{flex: '1', display: 'flex', justifyContent: 'flex-start'}}>
                    <label>Size: </label>
                    <input
                        id='sizeInput'
                        name='sizeInput'
                        type='number'
                        min='0'
                        max='20'
                        value={size.toString()}
                        onChange={e => {

                            const sanitizedValue = e.target.value.replace(/^[^0-9]*$/, '');

                            if (!/^[0-9]*$/.test(sanitizedValue)) return;

                            setSize(isNaN(sanitizedValue) ? 0 : parseInt(sanitizedValue));
                        }}
                        disabled={mode === 'SOLVE'}
                    />
                </div>
                <div>
                    <button
                        onClick={() => setMode(prevMode(modes, mode))}
                    >Prev
                    </button>
                    <strong>{mode}</strong>
                    <button
                        onClick={() => setMode(nextMode(modes, mode))}
                    >Next
                    </button>
                </div>
                <div style={{flex: '1', display: 'flex', justifyContent: 'flex-end'}}>
                    {mode === 'SETUP' &&
                        <>
                            <button
                                onClick={() => setIsUploadFixedOpened(true)}
                            >Fixed</button>
                            <button
                                onClick={() => setIsUploadConstraintOpened(true)}
                            >Constraint</button>
                            <button
                                onClick={() => setIsUploadSectionOpened(true)}
                            >Section</button>
                        </>
                    }
                </div>
            </div>
            <div className='fixed-cells-container'>
                <h4>Fixed Cells</h4>
                <ul>
                    {
                        fixedCells.map((cell) => <li key={`fixedx${cell.x}y${cell.y}`}>{cell.x}, {cell.y}</li>)
                    }
                </ul>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <div className='constraints'>
                    {constraints.map((constraint, index) => {
                        return (
                            <Constraint
                                index={constraint.index}
                                key={`${constraint.name}${index}`}
                                mode={mode}
                                setConstraint={(newConstraint) => {

                                    let newConstraints = [...constraints];
                                    newConstraints[newConstraint.index] = newConstraint;
                                    setConstraints(newConstraints);
                                }}
                                editWindowSize={size * CELL_SIZE}
                                constraint={constraint}
                                verifyRow={() => {

                                    console.log('Verifying: ' + constraint.name);
                                    const row = cells[index];

                                    let values = [];

                                    let currNum = '';
                                    for (const cell of row) {

                                        if (!cell.isBlack) {

                                            currNum += cell.number;
                                        } else {

                                            if (currNum === '') continue;

                                            values.push(parseInt(currNum));
                                            currNum = '';
                                        }
                                    }
                                    //push the last element if exists
                                    if (currNum !== '') values.push(parseInt(currNum));

                                    const newConstraints = [...constraints];

                                    newConstraints[index].correct = constraint.checker(values);

                                    setConstraints(newConstraints);
                                }}
                            >
                            </Constraint>
                        )
                    })}
                </div>
                <div
                    id='grid'
                    style={{
                        width: `${(CELL_SIZE) * size}px`,
                        height: `${(CELL_SIZE) * size}px`,
                        display: 'flex',
                        flexWrap: 'wrap',
                        boxSizing: 'content-box',
                    }}>
                    {
                        cells.map((row) => {

                            return row.map((cell) => {

                                return <Cell
                                    key={`${cell.x}, ${cell.y}`}
                                    mode={mode}
                                    cell={cell}
                                    className={`${cell.y % size !== size - 1 ? 'border-right-none' : ''} ${cell.x > 0 ? 'border-top-none' : ''}`}
                                    style={cell.section != null ? {backgroundColor: cell.section.color} : {}}
                                    onClick={(position) => {

                                        if (mode === 'SETUP') {

                                            if (currentSettingSection === null) onClickFixedHandler(position);
                                            else onClickSectionHandler(position);
                                        }
                                    }}
                                    onUpdateValue={(position, newValue) => onClickEditCellHandler(position, newValue)}
                                    isSettingSection={currentSettingSection !== null}
                                >
                                </Cell>
                            })
                        })
                    }
                </div>

                <div className='sidebar'>
                    <div>
                        {sections.map((section, index) => {

                            section.index = index;
                            return <Section
                                key={`${index}${section.color}`}
                                sectionNo={index}
                                mode={mode}
                                section={section}
                                currentSettingSection={currentSettingSection}
                                setCurrentSections={(value) => setCurrentSection(value)}
                                setCellsToValue={(section, value) => {

                                    let newCells = generateCellsCopy(cells);

                                    section.cells.map(cell => {

                                        let affectedCell = newCells[cell.x][cell.y];
                                        affectedCell.number = value;
                                        affectedCell.minimumValue = value;
                                        affectedCell.possibleValues = affectedCell.isFixed ? [Number(value)] : ['-', Number(value)]
                                    });

                                    let newSections = [...sections];
                                    newSections[section.index].initialValue = value;

                                    setSections(newSections);
                                    setCells(newCells);
                                }}
                                onRemove={(index) => {

                                    let newSections = [...sections];
                                    newSections.splice(index, 1);
                                    setSections(newSections);
                                }}
                            ></Section>
                        })}
                        <button
                            onClick={() => {

                                let newSections = [...sections];

                                newSections.push({
                                    color: generateRandomColor(),
                                    cells: []
                                });

                                setSections(newSections);
                            }}
                        >Add Section</button>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isUploadFixedOpened}
                onClose={() => setIsUploadFixedOpened(false)}
            >
                <div className='upload-modal'>
                    <div>
                        <h3>Manage Fixed Cells</h3>
                        <h4>Export Existing Cells</h4>
                        <p>This will generate a json file which you can use save state.</p>
                        <a href={generateJSONURI(fixedCells)} download='fixed_cells.json'>
                            <button>
                                Export
                            </button>
                        </a>
                        <hr></hr>
                        <h4>Import</h4>
                        <p>Please upload the file as a json object.
                            The object should be an array of positions.
                            Positions are objects with attributes x and y.
                            Out of bounds positions will be ignored. This app won't validate your stuff.
                        </p>
                        <p>E.g</p>
                        <pre>
                            {`[
    {x: 1, y: 3},
    {x: 1, y: 4}
]`}
                        </pre>
                        <input
                            type='file'
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                const fr = new FileReader();

                                fr.onload = (() => {

                                    try {
                                        const parsedJson = JSON.parse(fr.result);

                                        setFixedCells(parsedJson);
                                    } catch (e) {
                                        console.error(e);
                                    }
                                });

                                fr.readAsText(file)
                            }}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={isUploadConstraintOpened}
                onClose={() => setIsUploadConstraintOpened(false)}
            >
                <div className='upload-modal'>
                    <div>
                        <h3>Manage Constraints</h3>
                        <h4>Export Existing Constraints</h4>
                        <p>This will generate a json file which you can use save state.</p>
                        <a href={generateJSONURI(constraints.map(constraint => {return {...constraint, checker: constraint.checker.toString()}}))} download='constraints.json'>
                            <button>
                                Export
                            </button>
                        </a>
                        <hr></hr>
                        <h4>Import</h4>
                        <p>Please upload the file as a json object.
                            The object should be an array following the format below.
                            You may want to test your constraint checker yourself before uploading.
                            This app won't validate your stuff.
                        </p>
                        <p>
                            Values is an array of values for that row.
                            Your function should evaluate whether the values satisfy the criteria and return true/false.
                        </p>
                        <p>E.g</p>
                        <pre>
                            {`[
    {
    "name": "square",
    "checker": "(values) => {//function here//}"
  }
]`}
                        </pre>
                        <input
                            type='file'
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                const fr = new FileReader();

                                fr.onload = (() => {

                                    try {
                                        const parsedJson = JSON.parse(fr.result);

                                        parsedJson.forEach((item, index) => {
                                            item.index = index;
                                            item.checker = eval(item.checker);
                                        });
                                        setConstraints(parsedJson);
                                    } catch (e) {
                                        console.error(e);
                                    }
                                });

                                fr.readAsText(file)
                            }}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={isUploadSectionOpened}
                onClose={() => setIsUploadSectionOpened(false)}
            >
                <div className='upload-modal'>
                    <div>
                        <h3>Manage Sections</h3>
                        <h4>Export Existing Sections</h4>
                        <p>This will generate a json file which you can use save state.</p>
                        <a href={generateJSONURI(sections)} download='sections.json'>
                            <button>
                                Export
                            </button>
                        </a>
                        <hr></hr>
                        <h4>Import</h4>
                        <p>Please upload the file as a json object.
                            The object should be an array following the format below.
                            You may want to test your constraint checker yourself before uploading.
                            This app won't validate your stuff.
                        </p>
                        <p>
                            Should contain an array of cell positions for each section.
                            Colours will be assigned automatically
                        </p>
                        <p>E.g</p>
                        <pre>
                            {`[
  {
    "initialValue": 3,
    "cells": [{"x": 1, "y": 1}, {"x": 2, "y": 2}]
  }
]`}
                        </pre>
                        <input
                            type='file'
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                const fr = new FileReader();

                                fr.onload = (() => {

                                    try {
                                        const parsedJson = JSON.parse(fr.result);
                                        let newCells = generateCellsCopy(cells);

                                        parsedJson.forEach((item) => {
                                            item.color = generateRandomColor();
                                            item.cells.forEach((position) => {

                                                newCells[position.x][position.y].section = item;
                                                newCells[position.x][position.y].number = item.initialValue;
                                                newCells[position.x][position.y].minimumValue = item.initialValue;
                                            });
                                        });
                                        setSections(parsedJson);
                                        setCells(newCells);
                                    } catch (e) {
                                        console.error(e);
                                    }
                                });

                                fr.readAsText(file)
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </>
    )
}

const generateInitialState = (size) => {

    console.log('Generating initial state');
    const cells = [];

    for (let i = 0; i < size; i++) {

        const row = [];
        for (let j = 0; j < size; j++) {

            row.push({
                x: i,
                y: j,
                isFixed: false,
                isBlack: false,
                number: 0,
                possibleValues: ['-'],
                availableOverflow: 0,
                minimumValue: 0,
                originalValue: 0
            });

        }

        cells.push(row);
    }

    return cells;
}

const markFixedCells = (cells, fixedCells) => {

    let copy = generateCellsCopy(cells);

    return fixedCells.forEach(fixedCell => {

        if (fixedCell.x >= copy.length) return;
        if (fixedCell.y >= copy.length) return;
        copy[fixedCell.x][fixedCell.y].isFixed = true;
    });
}

const generateCellsCopy = (original) => {

    return [...original].map(row => [...row]);
}

const generateRandomColor = () => {
    //thanks to https://stackoverflow.com/questions/1484506/random-color-generator - Anatoliy
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i ++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    //Add alpha manually (dont want dark colors)
    color += '77';
    return color;
}

const generateInitialConstraints = (size) => {

    let constraints = [];
    for (let i = 0; i < size; i++) {

        constraints.push({
            index: i,
            name: '#' + (i + 1),
            checker: () => false
        });
    }

    return constraints;
}

const nextMode = (modes, currentMode) => {

    const index = modes.indexOf(currentMode);

    if (index + 1 < modes.length) {

        return modes[index + 1];
    }

    return currentMode;
}

const prevMode = (modes, currentMode) => {

    const index = modes.indexOf(currentMode);

    if (index - 1 >= 0) {

        return modes[index - 1];
    }

    return currentMode;
}

const generatePossibleValues = (cell, overflowAmount) => {

    const endNumber = Math.min(9, Number(overflowAmount) + Number(cell.minimumValue));

    let newPossibleValues = [];
    for (let i = Number(cell.minimumValue); i <= endNumber; i++) {

        newPossibleValues.push(i);
    }

    return newPossibleValues;
}

const generateJSONURI = (objectToDownload) => {

    return 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(objectToDownload));
}
