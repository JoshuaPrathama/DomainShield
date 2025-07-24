import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";

type Props = {
    totalData: number; // Total jumlah data
    matchedData: number; // Jumlah data yang sesuai
};

const CustomPieChart: React.FC<Props> = ({ totalData, matchedData }) => {
    const data = [
        { name: "Matched Data", value: matchedData },
        { name: "Remaining Data", value: totalData - matchedData },
    ];

    const COLORS = ["#DE402BFF", "#E0E0E0"]; // Hijau untuk matched, abu-abu untuk sisa

    return (
        <div className="relative flex justify-center items-center">
            {/* Animasi pie chart saat masuk */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="drop-shadow-lg"
            >
                <PieChart width={200} height={200}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index]}
                                className="transition-all duration-300 hover:opacity-75"
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </motion.div>

            {/* Text di tengah dengan efek animasi */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute text-xl font-bold text-gray-800"
            >
                <span className="text-3xl font-extrabold text-red-600">
                    {matchedData}
                </span>
                <span className="text-gray-500"> / {totalData}</span>
            </motion.div>
        </div>
    );
};

export default CustomPieChart;
