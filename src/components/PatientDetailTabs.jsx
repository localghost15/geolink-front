import React, {useState} from 'react';
import SunEditor from 'suneditor-react';
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button
} from "@material-tailwind/react";

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import DatePicker from './DatePicker';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import SendAnalysis from './SignAnalysis';
import { PaymentHistoryTable } from './PaymentHistoryTable';

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function AccordionCustomIcon() {
  const [open, setOpen] = React.useState(0);
  const [alwaysOpen, setAlwaysOpen] = React.useState(true);

  const handleAlwaysOpen = () => setAlwaysOpen((cur) => !cur);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <Accordion open={alwaysOpen} icon={<Icon id={1} open={open} />}>
        <AccordionHeader className='text-sm' onClick={handleAlwaysOpen}>Қайта қабул</AccordionHeader>
        <AccordionBody>
            <div className="flex gap-4">
            <DatePicker/>
            <Button className='flex gap-x-1'><ArrowPathIcon className='w-4 h-4' /> Қайта қабулга қўшиш</Button>
            </div>
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
        <AccordionHeader className='text-sm' onClick={() => handleOpen(2)}>
        Анализга юбориш
        </AccordionHeader>
        <AccordionBody>
        <SendAnalysis/>
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
        <AccordionHeader className='text-sm' onClick={() => handleOpen(3)}>
        Диспонсер рўйхати
        </AccordionHeader>
        <AccordionBody>
        <div className="flex gap-4">
            <DatePicker/>
            <Button className='flex gap-x-1'><ArrowPathIcon className='w-4 h-4' />Диспонсер рўйхатига қўшиш</Button>
            </div>
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 4} icon={<Icon id={4} open={open} />}>
        <AccordionHeader className='text-sm' onClick={() => handleOpen(4)}>
        Врач хулосаси
        </AccordionHeader>
        <AccordionBody>
        <SunEditor />
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 5} icon={<Icon id={5} open={open} />}>
        <AccordionHeader className='text-sm' onClick={() => handleOpen(5)}>
        МКБ-10
        </AccordionHeader>
        <AccordionBody>
          We&apos;re not always in the position that we want to be at. We&apos;re constantly
          growing. We&apos;re constantly making mistakes. We&apos;re constantly trying to express
          ourselves and actualize our dreams.
        </AccordionBody>
      </Accordion>
    </>
  );
}

function PatientDetailTabs() {
    const [selectedTab, setSelectedTab] = useState(1);

    const data = [
        {
          label: "Янги қабул",
          value: 1,
          desc: <AccordionCustomIcon value={1} />,
        },
        {
          label: "Тўловлар тарихи",
          value: 2,
          desc: <PaymentHistoryTable value={2} />,
        },
    
        {
          label: "Қабулларни кўриш",
          value: 3,
          desc: `Hali tayyor emas`,
        },
      ];

  return (
    <Tabs id="custom-animation" value={selectedTab}>
      <TabsHeader>
        {data.map(({ label, value }) => (
          <Tab className='w-max-content text-sm h-12' key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody
        animate={{
          initial: { y: 250 },
          mount: { y: 0 },
          unmount: { y: 250 },
        }}
      >
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value}>
            {desc}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  )
}

export default PatientDetailTabs;
