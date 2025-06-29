import {useEffect, useState} from 'react';

import {Cell} from '../Cell/Cell.jsx';
import {Section} from '../Section/Section.jsx';
import {Constraint} from '../Contstraint/Constraint.jsx';

//MODES: SET_FIXED, SET_SECTIONS, SOLVE
export const Grid = (props) => {

    const {
        size = 4
    } = props;

    const [mode, setMode] = useState('SET_FIXED');
    const [cells, setCells] = useState([]);
    const [fixedCells, setFixedCells] = useState([]);
    const [sections, setSections] = useState([
        {
            color: 'lightblue',
            cells: []
        }, {
            color: 'lightgreen',
            cells: []
        }, {
            color: 'lightyellow',
            cells: []
        }, {
            color: 'lightpink',
            cells: []
        }, {
            color: 'khaki',
            cells: []
        }, {
            color: 'lightsteelblue',
            cells: []
        }, {
            color: 'linen',
            cells: []
        }, {
            color: 'navajowhite',
            cells: []
        }, {
            color: 'plum',
            cells: []
        },

    ]);
    const [currentSettingSection, setCurrentSection] = useState(null);
    const [constraints, setConstraints] = useState([
        {
            name: 'square',
            checker: (values) => {

                return values.reduce((accumulator, currentValue) => {

                    return accumulator && Number.isInteger(Math.sqrt(currentValue))
                }, true);
            }
        },
        {
            name: 'product of digits = 20',
            checker: (values) => {

                return values.reduce((accumulator, currentValue) => {

                    const currentValueArray = currentValue.toString().split('').map(d => parseInt(d));

                    return accumulator && (currentValueArray.reduce((product, newValue) => product * newValue) === 20);
                }, true);
            }
        },
        {
            name: 'multiple of 13',
            checker: (values) => {

                return values.reduce((accumulator, currentValue) => {

                    return accumulator && (currentValue % 13 === 0);
                }, true);
            }
        },
        {
            name: 'multiple of 32',
            checker: (values) => {

                return values.reduce((accumulator, currentValue) => {

                    return accumulator && (currentValue % 32 === 0);
                }, true);
            }
        },
        {
            name: 'divisble by each digit',
            checker: (values) => {

                return values.reduce((accumulator, currentValue) => {

                    const currentValueArray = currentValue.toString().split('').map(d => parseInt(d));

                    return accumulator && currentValueArray.reduce((accumulator2, currentValue2) => {

                        return accumulator2 && currentValue % currentValue2 === 0;
                    }, true);
                }, true)
            }
        },
        {
            name: 'product of digits = 25',
            checker: (values) => {

                return values.reduce((accumulator, currentValue) => {

                    const currentValueArray = currentValue.toString().split('').map(d => parseInt(d));

                    return accumulator && (currentValueArray.reduce((product, newValue) => product * newValue) === 25);
                }, true);
            }
        },
        {
            name: 'divisible by each digit',
            checker: (values) => {

                return values.reduce((accumulator, currentValue) => {

                    const currentValueArray = currentValue.toString().split('').map(d => parseInt(d));

                    return accumulator && currentValueArray.reduce((accumulator2, currentValue2) => {

                        return accumulator2 && currentValue % currentValue2 === 0;
                    }, true);
                }, true)
            }
        },
        {
            name: 'odd palindrome',
            checker: (values) => {

                return values.reduce((accumulator, currentValue) => {

                    const currentValueArray = currentValue.toString().split('').map(d => parseInt(d));

                    let l = 0;
                    let r = currentValueArray.length - 1;

                    let res = currentValueArray[0] % 2 === 1;
                    while (l <= r) {

                        if (currentValueArray[l] !== currentValueArray[r]) {

                            res = false;
                            break;
                        }

                        l++;
                        r--;
                    }

                    return accumulator && res;
                }, true);
            }
        },
        {
            name: 'fibonacci',
            checker: (values) => {

                return values.reduce((accumulator, currentValue) => {

                    return accumulator && (
                        Number.isInteger(Math.sqrt(5 * currentValue * currentValue + 4)) ||
                        Number.isInteger(Math.sqrt(5 * currentValue * currentValue - 4))
                    );
                }, true);
            }
        },
        {
            name: 'product of digits = 2025',
            checker: (values) => {

                return values.reduce((accumulator, currentValue) => {

                    const currentValueArray = currentValue.toString().split('').map(d => parseInt(d));

                    return accumulator && (currentValueArray.reduce((product, newValue) => product * newValue) === 2025);
                }, true);
            }
        },
        {
            name: 'prime',
            checker: (values) => {

                return values.reduce((accumulator, currentValue) => {

                    let isPrime = true;
                    const lowerSqrt = Math.floor(Math.sqrt(currentValue));

                    if (currentValue >= 2) {

                        for (let i = 2; i <= lowerSqrt; i++) {

                            if (currentValue % i === 0) {

                                isPrime = false;
                                break;
                            }
                        }
                    } else if (currentValue === 1) {

                        isPrime = false;
                    }

                    return accumulator && isPrime;
                }, true);
            }
        },
    ]);

    useEffect(() => {

        setCells(generateInitialState(size));
    }, [size]);

    useEffect(() => {

        markFixedCells(cells, fixedCells);
    }, [cells, fixedCells]);
    
    const cellOnClickFunctionGenerator = (mode) => {

        switch (mode) {
            case 'SET_FIXED':
                return ((position) => {

                    let newFixedCells = [...fixedCells];
                    newFixedCells.push(position);
                    setFixedCells(newFixedCells);

                    let newCells = generateCellsCopy(cells);
                    newCells[position.x][position.y].isFixed = true;
                    setCells(newCells);
                });
            case 'SET_SECTIONS':
                return ((position) => {

                });
            case 'SOLVE':
                break;
            default:
                return () => {};
        }
    }

    return (
        <div style={{display: 'flex'}}>
            {mode === 'SOLVE' &&
                <div style={{
                    margin: '0 40px 0 0'
                }}>
                    {constraints.map((constraint, index) => {
                        return (
                            <Constraint
                                key={index}
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
            }
            <div
                id='grid'
                style={{
                    width: `${(40 + 1) * size + 1}px`,
                    height: `${(40 + 1) * size + 1}px`,
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                {
                    cells.map((row) => {

                        return row.map((cell) => {

                            return <Cell
                                key={`${cell.x}, ${cell.y}`}
                                x={cell.x}
                                y={cell.y}
                                isFixed={cells[cell.x][cell.y].isFixed}
                                isBlack={cells[cell.x][cell.y].isBlack}
                                number={cells[cell.x][cell.y].number}
                                className={`${cell.y % size !== size - 1 ? 'border-right-none' : ''} ${cell.x > 0 ? 'border-top-none' : ''}`}
                                style={cell.section != null ? {backgroundColor: cell.section.color} : {}}
                                onClick={cellOnClickFunctionGenerator(mode)}
                                updateCellValue={(position, newValue) => {

                                    console.log(`position: ${position.x}, ${position.y}, newValue: ${newValue}`);
                                    const newRow = [...cells[position.x]];
                                    newRow[position.y].number = newValue;
                                    newRow[position.y].isBlack = false;
                                    const newCells = [...cells];
                                    newCells[position.x] = newRow;

                                    setCells(newCells);

                                    const newConstraints = [...constraints];

                                    newConstraints[position.x].correct = null;

                                    setConstraints(newConstraints);
                                }}
                                isSettingSection={currentSettingSection !== null}
                                setSection={position => {

                                    const newSections = [...sections];
                                    newSections[currentSettingSection].cells.push(position);
                                    setSections(newSections);

                                    const newRow = [...cells[position.x]];
                                    newRow[position.y].section = sections[currentSettingSection];
                                    const newCells = [...cells];
                                    newCells[position.x] = newRow;

                                    setCells(newCells);

                                    const newConstraints = [...constraints];

                                    newConstraints[position.x].correct = null;

                                    setConstraints(newConstraints);
                                }}
                                setIsBlack={position => {

                                    const newRow = [...cells[position.x]];
                                    newRow[position.y].isBlack = true;
                                    newRow[position.y].number = '-';
                                    const newCells = [...cells];
                                    newCells[position.x] = newRow;

                                    setCells(newCells);

                                    const newConstraints = [...constraints];

                                    newConstraints[position.x].correct = null;

                                    setConstraints(newConstraints);
                                }}
                            >
                            </Cell>
                        })
                    })
                }
            </div>

            {mode === 'SET_FIXED' &&
                <div>
                    <h4>Fixed Cells</h4>
                    <ul>
                        {
                            fixedCells.map((cell) => <li key={`fixedx${cell.x}y${cell.y}`}>{cell.x}, {cell.y}</li>)
                        }
                    </ul>
                    <button
                        onClick={() => setMode('SET_SECTIONS')}
                    >Next</button>
                </div>
            }
            {mode === 'SET_SECTIONS' &&
                <div>
                    {sections.map((section, index) => {

                        return <Section
                            name={section.name}
                            sectionNo={index}
                            color={section.color}
                            cells={section.cells}
                            currentSettingSection={currentSettingSection}
                            setCurrentSections={(value) => {

                                setCurrentSection(value);
                            }}
                            setCellsToValue={(affectedCells, value) => {

                                let newCells = [...cells];
                                newCells.map(row => {

                                    return [...row];
                                });

                                affectedCells.map(cell => {

                                    newCells[cell.x][cell.y].number = value;
                                })

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
            }
        </div>
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
            });

        }

        cells.push(row);
    }

    return cells;
}

const markFixedCells = (cells, fixedCells) => {

    let copy = generateCellsCopy(cells);

    return fixedCells.forEach(fixedCell => {

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