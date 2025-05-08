import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  Packer,
  TextRun,
} from 'docx';
import { saveAs } from 'file-saver';
import moment from 'moment';

const createCell = (text, options = {}) => {
  const {
    bold = false,
    align = AlignmentType.LEFT,
    columnSpan = 1,
    borders = {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
    },
  } = options;

  return new TableCell({
    borders,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold,
            size: 24,
          }),
        ],
        alignment: align,
      }),
    ],
    columnSpan,
  });
};

const createPrescriptionTable = (prescription: API.Appointment) => {
  const rows = [
    // 标题行
    new TableRow({
      children: [
        new TableCell({
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: '收费单据',
                  bold: true,
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          columnSpan: 5,
        }),
      ],
    }),

    // 基本信息行
    new TableRow({
      children: [
        createCell('单据编号：', { bold: true }),
        createCell(prescription.id + ''),
        createCell('开单日期：', { bold: true }),
        createCell(prescription.appointmentTime),
      ],
    }),
    new TableRow({
      children: [
        createCell('患者姓名：', { bold: true }),
        createCell(prescription.patientName),
        createCell('患者邮箱：', { bold: true }),
        createCell(prescription.patientEmail),
      ],
    }),
    new TableRow({
      children: [
        createCell('患者病情：', { bold: true }),
        createCell(prescription.patientDescription, { columnSpan: 4 }),
      ],
    }),
    new TableRow({
      children: [
        createCell('诊断结果：', { bold: true }),
        createCell(prescription.diagnosticResult, { columnSpan: 4 }),
      ],
    }),
    new TableRow({
      children: [
        createCell('医嘱：', { bold: true }),
        createCell(prescription.doctorAdvice, { columnSpan: 4 }),
      ],
    }),

    // 药品表头
    new TableRow({
      children: [
        createCell('药品名称', { bold: true, align: AlignmentType.CENTER }),
        createCell('数量', { bold: true, align: AlignmentType.CENTER }),
        createCell('单价(元)', { bold: true, align: AlignmentType.CENTER }),
        createCell('金额(元)', { bold: true, align: AlignmentType.CENTER }),
      ],
    }),

    // 药品明细
    ...prescription.drug.map((drug) => {
      return new TableRow({
        children: [
          createCell(drug.name, { align: AlignmentType.CENTER }),
          createCell(drug.count.toString(), { align: AlignmentType.CENTER }),
          createCell(drug.price, { align: AlignmentType.RIGHT }),
          createCell(drug.totalPrice.toFixed(2), {
            align: AlignmentType.RIGHT,
          }),
        ],
      });
    }),

    // 总金额行
    new TableRow({
      children: [
        createCell('总金额：', { bold: true, align: AlignmentType.LEFT }),
        createCell(prescription.totalAmount.toFixed(2), {
          align: AlignmentType.RIGHT,
          columnSpan: 4,
        }),
      ],
    }),

    // 底部签名行
    new TableRow({
      children: [
        createCell('医生签名：', { bold: true }),
        createCell(prescription.doctorName || ''),
        createCell('开具时间：', { bold: true }),
        createCell(moment().format('YYYY-MM-DD HH:mm:ss')),
      ],
    }),
  ];

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows,
  });
};

export const generatePrescriptionDoc = async (prescription: API.Appointment) => {
  console.log(prescription);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children: [
          createPrescriptionTable(prescription),
          new Paragraph({
            text: '',
            spacing: { before: 400 },
            pageBreakAfter: true,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `收费单据_${moment().format('YYYY-MM-DD')}.docx`);
};
