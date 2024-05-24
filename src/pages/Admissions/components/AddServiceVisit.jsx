import React from 'react';
import { Dialog, Card, CardBody, CardFooter, Button } from "@material-tailwind/react";
import Select from 'react-select';

export default function AddServiceVisit({
                                            open,
                                            onClose,
                                            services,
                                            handleServiceSelect,
                                            handlePaymentMethodSelect,
                                            handleSave,
                                            id
                                        }) {

    return (
        <Dialog open={open} handler={(cur) => !cur}  className="bg-transparent shadow-none">
            <Card className="mx-auto w-full max-w-[24rem]">
                <CardBody className="flex flex-col gap-4">
                    <Select
                        options={services.map(service => ({
                            value: service.id,
                            label: service.name
                        }))}
                        onChange={(selectedOption) => handleServiceSelect(selectedOption.value)}
                        placeholder="Выберите сервис"
                    />
                    <div className="flex flex-col">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="paymentMethod"
                                value="cash"
                                onChange={() => handlePaymentMethodSelect("cash")}
                            />
                            <span className="ml-2">Наличные</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="paymentMethod"
                                value="card"
                                onChange={() => handlePaymentMethodSelect("card")}
                            />
                            <span className="ml-2">Карта</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="paymentMethod"
                                value="credit"
                                onChange={() => handlePaymentMethodSelect("credit")}
                            />
                            <span className="ml-2">Кредит</span>
                        </label>
                    </div>
                </CardBody>
                <CardFooter className="pt-0">
                    <CardFooter className="pt-0">
                        <Button onClick={() => handleSave(id)}>Саклаш</Button>
                    </CardFooter>
                </CardFooter>
            </Card>
        </Dialog>
    );
}
