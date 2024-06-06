import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import {Button, Descriptions, FloatButton, Image, Spin} from "antd";
import {fetchRevisits, fetchVisits} from "../services/visitService";
import {getDispensaryDataPatient} from "../services/dispansery";
import {ClipboardDocumentCheckIcon} from "@heroicons/react/24/solid";
import {BsPrinterFill} from "react-icons/bs";

const ParentAdmission = () => {
    const { index } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostRecentVisit, setMostRecentVisit] = useState(null);
    const [visits, setVisits] = useState({});
    const [visitId, setVisitId] = useState(null);
    const [dataCache, setDataCache] = useState({});
    const [revisits, setRevisits] = useState([]);

    const [dispensaryData, setDispensaryData] = useState(null);

    const printPage = () => {
        window.print();
    }

    useEffect(() => {
        const fetchDispensaryData = async () => {
            if (mostRecentVisit && mostRecentVisit.id) {
                try {
                    const data = await getDispensaryDataPatient(mostRecentVisit.id);
                    setDispensaryData(data);
                } catch (error) {
                    console.error('Ошибка при получении данных о диспансере:', error);
                }
            }
        };
        fetchDispensaryData();
    }, [mostRecentVisit]);

    const renderDispensaryDates = () => {
        if (dispensaryData && dispensaryData.data) {
            const currentVisitDate = dispensaryData.data[0]?.visit?.date;
            const mouthDays = dispensaryData.data.map(item => item.mouth_days).flat();
            return (
                <ul>
                    {mouthDays.length > 0
                        ? mouthDays.map(date => <li key={date}>{date}</li>)
                        : <li>Диспансер рўхатлари йуқ</li>}
                </ul>
            );
        }
        return <li>Диспансер рўхатлари йуқ</li>;
    };

    useEffect(() => {
        if (visits && Object.keys(visits).length > 0) {
            const patientVisits = visits[index];
            if (Array.isArray(patientVisits)) {
                const recentVisit = patientVisits.reduce((latest, visit) => {
                    if (!visit.parent_id && ["queue", "examined", "new"].includes(visit.status)) {
                        if (!latest || new Date(visit.date_at) > new Date(latest.date_at)) {
                            return visit;
                        }
                    }
                    return latest;
                }, null);
                setMostRecentVisit(recentVisit);
            }
        }
    }, [visits, index]);


    const fetchPatientVisits = async () => {
        try {
            let visitData = [];
            if (!dataCache[index]) {
                const fetchAllPages = async (patientId) => {
                    let allData = [];
                    let page = 1;
                    let lastPage = 1;

                    while (page <= lastPage) {
                        try {
                            const response = await fetchVisits(patientId, page);
                            const pageData = response.data.data;
                            const meta = response.data.meta;

                            allData = [...allData, ...pageData];
                            lastPage = meta.last_page; // обновляем количество страниц
                            page += 1; // переходим к следующей странице
                        } catch (error) {
                            console.error(`Ошибка при получении данных со страницы ${page}:`, error);
                            break;
                        }
                    }

                    return allData;
                };

                visitData = await fetchAllPages(index);

                setDataCache(prevCache => ({
                    ...prevCache,
                    [index]: visitData,
                }));
            } else {
                visitData = dataCache[index];
            }

            const recentVisit = visitData.find(visit =>
                visit.parent_id === null &&
                (visit.bill === "payed" || visit.bill === "pending") && (visit.status === "new" || visit.status === "examined" || visit.status === "queue")
            );

            if (recentVisit) {
                setVisitId(recentVisit.id);
            } else {
                setVisitId(null);
            }

            setVisits(prevVisits => ({
                ...prevVisits,
                [index]: visitData,
            }));
        } catch (error) {
            console.error('Ошибка при получении данных о визитах:', error);
        }
    };


    const fetchPatientRevisits = async () => {
        try {
            const page = 1; // Assuming you want the first page, you can modify this if needed
            const response = await fetchRevisits(index, page);
            setRevisits(response.data.data);
        } catch (error) {
            console.error('Ошибка при получении данных о повторных визитах:', error);
        }
    };

    useEffect(() => {
        fetchPatientVisits();
        fetchPatientRevisits();
    }, [index, dataCache]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchPatient = async () => {
            try {
                const response = await axios.get(`https://back.geolink.uz/api/v1/patients/${index}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setPatient(response.data.data);
                setLoading(false);
            } catch (error) {
                setError("Ошибка при получении информации о пациенте");
                setLoading(false);
            }
        };
        fetchPatient();
    }, [index]);

    if (loading) {
        return  <Spin spinning={loading} tip="Loading" size="large">
        </Spin>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="px-10 ">
            {patient ? (
              <>
                  <Descriptions
                      title="Бемор малумоти"
                      bordered
                      column={{
                          xs: 1,
                          sm: 2,
                          md: 3,
                          lg: 3,
                          xl: 4,
                          xxl: 4,
                      }}
                  >
                      <Descriptions.Item label="Код">SHH7FX6DG</Descriptions.Item>
                      <Descriptions.Item label="ФИО">{patient.name}</Descriptions.Item>
                      <Descriptions.Item label="Тугилган куни">{patient.birth_at}</Descriptions.Item>
                      <Descriptions.Item label="Печать"> <Button onClick={printPage}  icon={<BsPrinterFill className='w-4 h-4'/>} fullWidth  type="dashed" size="middle" className='capitalize flex items-center  my-2'> Принтердан чиқариш</Button></Descriptions.Item>

                  </Descriptions>
                  <Descriptions
                      className="mt-4"
                      title="Касалликларнинг халкаро таснифи"
                      bordered
                      column={{
                          xs: 1,
                          sm: 1,
                          md: 1,
                          lg: 1,
                          xl: 1,
                          xxl: 1,
                      }}
                  >
                      <Descriptions.Item labelStyle={{width: 120}} label="МКБ10">

                          {patient.mkb10.map(item => (
                              <div className="w-full" key={item.id}>
                                  <p>{item.name}</p>
                              </div>
                          ))}
                      </Descriptions.Item>
                  </Descriptions>
                  <Descriptions
                      className="mt-4"
                      title="Врач Хулосаси"
                      bordered
                      column={{
                          xs: 1,
                          sm: 1,
                          md: 1,
                          lg: 1,
                          xl: 1,
                          xxl: 1,
                      }}
                  >
                      <Descriptions.Item labelStyle={{width: 200}} label="Хулоса">

                          {mostRecentVisit && mostRecentVisit.remark ? '' : 'Хулоса йоқ...'}
                      </Descriptions.Item>
                  </Descriptions>
                  <Descriptions
                      className="mt-4"
                      title="Қайта қабуллар"
                      bordered
                      column={{
                          xs: 1,
                          sm: 1,
                          md: 1,
                          lg: 1,
                          xl: 1,
                          xxl: 1,
                      }}
                  >
                      <Descriptions.Item labelStyle={{ width: 200 }} label="Қайта қабуллар">
                          {revisits.length > 0 ? (
                              <ul>
                                  {revisits.map(revisit => (
                                      <li key={revisit.id}>{revisit.date_at}</li>
                                  ))}
                              </ul>
                          ) : (
                              <p>Повторных визитов нет</p>
                          )}
                      </Descriptions.Item>
                  </Descriptions>
                  <Descriptions
                      className="mt-4"
                      title="Диспансер руйхатлари"
                      bordered
                      column={{
                          xs: 1,
                          sm: 1,
                          md: 1,
                          lg: 1,
                          xl: 1,
                          xxl: 1,
                      }}
                  >
                      <Descriptions.Item labelStyle={{width: 200}} label="Диспансер санаси">

                          {renderDispensaryDates()}
                      </Descriptions.Item>
                  </Descriptions>
                  <Descriptions
                      className="mt-4"
                      title="Юкланган файллар:"
                      bordered
                      column={{
                          xs: 1,
                          sm: 1,
                          md: 1,
                          lg: 1,
                          xl: 1,
                          xxl: 1,
                      }}
                  >
                      <Descriptions.Item labelStyle={{width: 200}} label="Рентген, документ , расм ...">
                          <Image.PreviewGroup
                              preview={{
                                  onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                              }}
                          >
                              {mostRecentVisit ? mostRecentVisit.files.map(file => (
                                  <Image key={file.id}
                                         width={100}
                                         src={file.url}
                                  />
                              )) : ''}
                          </Image.PreviewGroup>
                      </Descriptions.Item>

                  </Descriptions>

              </>
            ) : (
                <p>Информация о пациенте не найдена</p>
            )}
        </div>
    );
};



export default ParentAdmission;
