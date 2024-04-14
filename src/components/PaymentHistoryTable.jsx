import { Card, Typography } from "@material-tailwind/react";
 
const TABLE_HEAD = ["Хизматлар", "Нархи", "Берилган сумма / Кун / Вақт", "Приём номер"];
 
const TABLE_ROWS = [
  {
    name: "Капельница (2 дона)",
    price: 100000,
    sdt: "275 000 сум, 04.04.2024, 12:47:04",
  },
  {
    name: "Врач куриги (1 дона)",
    price: 50000,
    sdt: "275 000 сум, 04.04.2024, 12:47:04",
  },
];
 
export function PaymentHistoryTable() {
  return (
    <Card className="h-full w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map(({ name, price, sdt }, index) => (
            <tr key={name} className="even:bg-blue-gray-50/50">
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {name}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {price}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {sdt}
                </Typography>
              </td>
              <td className="p-4">
              <Typography variant="small" color="blue-gray" className="font-normal">
              1a5e8c36-7bce-4c8c-8caa-29fc4ed7da2c
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}