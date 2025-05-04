import { useEffect, useState } from 'react';

import { Cell } from '../Cell/Cell.jsx';
import { Section } from '../Section/Section.jsx';

export const Grid = (props) => {

  const {
    size = 4,
    yellowCells = [],
    constraints = []
  } = props;

  const [cells, setCells] = useState([]);
  const [sections, setSections]= useState([
    {
      name: 'Section 1',
      initialNumber: 1,
      color: 'lightblue',
      cells: []
    },{
      name: 'Section 2',
      initialNumber: 2,
      color: 'lightgreen',
      cells: []
    },{
      name: 'Section 3',
      initialNumber: 3,
      color: 'lightyellow',
      cells: []
    },{
      name: 'Section 4',
      initialNumber: 4,
      color: 'lightpink',
      cells: []
    },{
      name: 'Section 5',
      initialNumber: 5,
      color: 'khaki',
      cells: []
    },{
      name: 'Section 6',
      initialNumber: 6,
      color: 'lightsteelblue',
      cells: []
    },{
      name: 'Section 7',
      initialNumber: 7,
      color: 'linen',
      cells: []
    },{
      name: 'Section 8',
      initialNumber: 8,
      color: 'navajowhite',
      cells: []
    },{
      name: 'Section 9',
      initialNumber: 9,
      color: 'plum',
      cells: []
    },

  ]);
  const [currentSettingSection, setCurrentSection] = useState(null);

  useEffect(() => {

    if (cells.length === 0) {

      setCells(generateInitialState(size, yellowCells));
    }
  }, []);

  return (
    <div style={{display: 'flex'}}>
      <div style={{
        margin: '0 40px 0 0'
      }}>
        {constraints.map((constraint, index) => {
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                height: '41px',
                justifyContent: 'end',
                alignItems: 'center'
              }}
            >
              {constraint.name}
            </div>
          )
        })}
      </div>
      <div
        id='grid'
        style={{
          width: `${42 * size}px`,
          height: `${41 * size}px`,
          display: 'flex',
          flexWrap: 'wrap',
        }}>
        {
          cells.map((row) => {

            return row.map((cell) => {

              return <Cell
                key={`${cell.x}, ${cell.y}`}
                x={cell.x}
                y={cell.y}
                isYellow={cells[cell.x][cell.y].isYellow}
                isBlack={cells[cell.x][cell.y].isBlack}
                number={cells[cell.x][cell.y].number}
                style={cell.section != null ? {backgroundColor: cell.section.color} : {}}
                updateCellValue={(position, newValue) => {

                  console.log(`position: ${position.x}, ${position.y}, newValue: ${newValue}`);
                  const newRow = [...cells[position.x]];
                  newRow[position.y].number = newValue;
                  newRow[position.y].isBlack = false;
                  const newCells = [...cells];
                  newCells[position.x] = newRow;

                  setCells(newCells);
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
                }}
                setIsBlack={position => {

                  const newRow = [...cells[position.x]];
                  newRow[position.y].isBlack = true;
                  newRow[position.y].number = '-';
                  const newCells = [...cells];
                  newCells[position.x] = newRow;

                  setCells(newCells);
                }}
              >
              </Cell>
            })
          })
        }
      </div>
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
          ></Section>
        })}
      </div>
    </div>
  )
}

const generateInitialState = (size, yellowCells) => {

  console.log('Generating initial state');
  const cells = [];

  for (let i = 0; i < size; i++) {

    const row = [];
    for (let j = 0; j < size; j++) {

      row.push({
        x: i,
        y: j,
        isYellow: false,
        isBlack: false,
        number: 0,
      });

    }

    cells.push(row);
  }

  yellowCells.forEach(yellowCell => {

    cells[yellowCell.x][yellowCell.y].isYellow = true;
  });

  return cells;
}