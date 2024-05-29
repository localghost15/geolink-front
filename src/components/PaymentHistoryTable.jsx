import React, { useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../axios/axiosInstance";
import {
  Card,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip, Dialog, DialogBody,
} from "@material-tailwind/react";

const TABLE_HEAD = ["ID", "Навбат номери", "Сана", "Умумий қиймат", "Хизматлар", "Чек"];
const TABLE_DIALOG = ["Чек", "Хизматлар", "Нархи"];

export function PaymentHistoryTable({ patientId }) {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowClick = (visit) => {
    setSelectedVisit(visit);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVisit(null);
    setModalOpen(false);
  };

  useEffect(() => {
    fetchVisits(currentPage);
  }, [currentPage, patientId]);

  const fetchVisits = async (page) => {
    try {
      const response = await axiosInstance.get(`/visit?patient_id=${patientId}&page=${page}`);
      const uniqueVisits = removeDuplicateVisits(response.data.data);
      setVisits(uniqueVisits);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Error fetching visits:", error);
    }
  };

  const removeDuplicateVisits = (visits) => {
    const visitedIds = new Set();
    return visits.filter(visit => {
      const uniqueKey = `${visit.id}`;
      if (visitedIds.has(uniqueKey)) {
        return false;
      }
      visitedIds.add(uniqueKey);
      return true;
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
      <Card className="h-full w-full">
        <CardBody className="overflow-scroll px-0">
          <table className="w-full table-auto text-left">
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
            {visits.map((visit, index) => (
                <tr key={visit.id} onClick={() => handleRowClick(visit)} className="transition-colors hover:bg-gray-100">
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {index + 1}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {visit.id}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {visit.date_at}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {visit.orders.amount}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {visit.orders.service.name}
                      {visit.chilrens.length > 0 && ', '}
                      {visit.chilrens
                          .map(child => child.orders.service.name)
                          .filter((serviceName, index, self) =>
                              index === self.indexOf(serviceName) && serviceName !== visit.orders.service.name)
                          .slice(0, 2)
                          .map((serviceName, index, array) => (
                              <React.Fragment key={index}>
                                {index > 0 && ', '}
                                {serviceName}
                                {index === 1 && array.length > 1 && visit.chilrens.length > 3 && '...'}
                              </React.Fragment>
                          ))}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {visit.orders.id}
                    </Typography>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {meta.current_page} of {meta.last_page}
          </Typography>
          <div className="flex gap-2">
            {meta.links && meta.links.map((link, index) => (
                <Button
                    key={index}
                    variant={link.active ? "filled" : "outlined"}
                    size="sm"
                    onClick={() => link.url && handlePageChange(link.url.split('page=')[1])}
                    disabled={!link.url}
                >
                  {link.label.replace(/&laquo;|&raquo;/g, '')}
                </Button>
            ))}
          </div>
        </CardFooter>

        <Dialog className="backdrop:bg-white/50 backdrop:backdrop-blur-md" open={modalOpen} handler={handleCloseModal}>
          <DialogBody className="h-[22rem] overflow-scroll">
            <table className="w-full">
              <thead>
              <tr>
                {TABLE_DIALOG.map((head, index) => (
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
              {selectedVisit && (
                  <tbody>
                  {selectedVisit.chilrens.map((child, index) => (
                      <tr key={index}>
                        <td className="p-4 border-b border-blue-gray-50">{child.orders.id}</td>
                        <td className="p-4 border-b border-blue-gray-50">{child.orders.service.name}</td>
                        <td className="p-4 border-b border-blue-gray-50">{child.orders.amount}</td>
                      </tr>
                  ))}
                  {selectedVisit.orders.service && (
                      <tr>
                        <td className="p-4 border-b border-blue-gray-50">{selectedVisit.orders.id}</td>
                        <td className="p-4 border-b border-blue-gray-50">{selectedVisit.orders.service.name}</td>
                        <td className="p-4 border-b border-blue-gray-50">{selectedVisit.orders.amount}</td>
                      </tr>
                  )}
                  </tbody>
              )}
            </table>
          </DialogBody>
        </Dialog>
      </Card>
  );
}
