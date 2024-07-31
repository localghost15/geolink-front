import React from 'react';
import { Rect, Text } from 'react-konva';
import { IoBed } from 'react-icons/io5';

const Bed = ({ bed, onClick }) => {
    const { id, x, y, reserved } = bed;

    return (
        <>
            <Rect
                x={x}
                y={y}
                width={60}
                height={30}
                fill={reserved ? '#FFD700' : '#00AA81'}
                stroke="#F5FFFA"
                strokeWidth={1}
                cornerRadius={4}
                onClick={() => onClick(id)}
                onMouseEnter={(e) => e.target.to({ scaleX: 1.05, scaleY: 1.05 })}
                onMouseLeave={(e) => e.target.to({ scaleX: 1, scaleY: 1 })}
            />
            <IoBed
                x={x + 18}
                y={y + 5}
                size={20}
                color="#FFFFFF"
                style={{ cursor: 'pointer' }}
                onClick={() => onClick(id)}
            />
            <Text
                x={x}
                y={y + 40}
                text={`Кровать ${id}`}
                fontSize={14}
                fontFamily="'Roboto', sans-serif"
                fill="#212121"
                fontStyle="bold"
            />
        </>
    );
};

export default Bed;
