import React, {useState} from "react";
import { CustomLink } from "../../components/CustomLink";
import {MagnifyingGlassIcon,ChevronUpDownIcon} from "@heroicons/react/24/outline";
  import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
  import {
    Card,CardHeader,Typography,Button,CardBody,CardFooter,Avatar,IconButton,Tooltip} from "@material-tailwind/react";
  import ListsMenu from "./components/ListsMenu";
  import PatientsDialog from "./components/PatientsDialog";
  
  const TABLE_HEAD = ["ФИО", "Туғилган санаси", "Телефон", "Идентификатор", "Харакат"];
  
  const TABLE_ROWS = [];
  
  export default function Patients() {
    const [patients, setPatients] = useState(TABLE_ROWS);
  
    const handleAddPatient = (newPatient) => {
      console.log("New Patient Received:", newPatient);
      setPatients([...patients, newPatient]);
    };
  
    return (
      <Card className="h-full w-full rounded-none pt-5">
        <Typography className="mx-8 mb-2" variant="h3" color="black">
          Барча беморлар
        </Typography>
  
        <div className="flex mx-8 justify-between gap-8">
          <label
            className="relative  bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2  focus-within:border-gray-300"
            htmlFor="search-bar"
          >
            <ListsMenu/>
  
            <input
              id="search-bar"
              placeholder="Қидириш"
              className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
            />
            <Button size="md">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Button>
          </label>
  
          <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
            <PatientsDialog onAddPatient={handleAddPatient}/>
          </div>
        </div>
  
        <CardHeader floated={false} shadow={false} className="rounded-none"></CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4  w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}{" "}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map(({ files, fullName, workPlace, birthDate, id, phoneNumber }, index) => {
                const isLast = index === patients.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar src={files ? URL.createObjectURL(files) : ""} size="sm" />
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {fullName}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                            {workPlace}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {birthDate}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {phoneNumber}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {id}
                        </Typography>
                      </div>
                    </td>
  
                    <td className={classes}>
                      <Tooltip content="Ўзгартириш">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Бемор картаси">
                      <CustomLink to={`/patient/${index}`}>
                        <IconButton variant="text">
                          <EyeIcon className="h-4 w-4" />
                        </IconButton>
                        </CustomLink>
                      </Tooltip>
                      <Tooltip content="Ўчириш">
                        <IconButton variant="text">
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Сахифа 1/10
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              Олдинги
            </Button>
            <Button variant="outlined" size="sm">
              Кейингиси
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }