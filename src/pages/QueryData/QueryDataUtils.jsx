// import React from 'react';

// export const tableToWidget = (table, columns) => ({
//   label: table,
//   type: '!group',
//   //   subfields: {
//   //     product: {
//   //       type: "select",
//   //       fieldSettings: {
//   //         listValues: ["abc", "def", "xyz"],
//   //       },
//   //       valueSources: ["value"],
//   //     },
//   //     score: {
//   //       type: "number",
//   //       fieldSettings: {
//   //         min: 0,
//   //         max: 100,
//   //       },
//   //       valueSources: ["value"],
//   //     }
//   //   }
//   subfields: Object.fromEntries(
//     columns.map(column => [column.COLUMN_NAME, columnToSubfield(column)]),
//   ),
// });

// const columnToSubfield = column => {
//   const { COLUMN_NAME } = column;
//   const subfield = {
//     // TODO: DETERMINE TYPE
//     type: 'number',
//     valueSources: ['value'],
//   };
//   return subfield;
// };
