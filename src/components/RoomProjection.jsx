import React, { useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { MdDoorFront } from 'react-icons/md'; // Door icon
import Bed from './Bed';

const RoomProjection = () => {
    const [beds, setBeds] = useState([
        { id: 1, x: 100, y: 100, reserved: false },
        { id: 2, x: 200, y: 100, reserved: false },
        { id: 3, x: 300, y: 100, reserved: false },
        { id: 4, x: 100, y: 200, reserved: false },
        { id: 5, x: 200, y: 200, reserved: false },
        { id: 6, x: 300, y: 200, reserved: false },
        { id: 7, x: 100, y: 300, reserved: false },
        { id: 8, x: 200, y: 300, reserved: false },
        { id: 9, x: 300, y: 300, reserved: false },
    ]);

    const handleBedClick = (id) => {
        setBeds(beds.map(bed =>
            bed.id === id ? { ...bed, reserved: !bed.reserved } : bed
        ));
    };

    return (
        <Stage width={500} height={500}>
            <Layer>
                <Rect
                    x={50}
                    y={50}
                    width={380}
                    height={350}
                    fill="#FAFAFA"
                    stroke="#E0E0E0"
                    strokeWidth={2}
                    cornerRadius={10}
                />
                <Text
                    x={50}
                    y={20}
                    text="Комната 1"
                    fontSize={24}
                    fontFamily="'Roboto', sans-serif"
                    fill="#212121"
                    fontStyle="bold"
                />
                <MdDoorFront
                    x={230}
                    y={50}
                    size={40}
                    color="#00AA81"
                />
                <Text
                    x={230}
                    y={65}
                    text="Дверь"
                    fontSize={16}
                    fontFamily="'Roboto', sans-serif"
                    fill="#212121"
                />
                {beds.map(bed => (
                    <Bed key={bed.id} bed={bed} onClick={handleBedClick} />
                ))}
            </Layer>
        </Stage>
    );
};

export default RoomProjection;
