import { useState } from "react";

import Chart from "react-apexcharts";

type ComponentProps = {
    userName: string
}

export function CardMain({userName}: ComponentProps){
    const [mouseOverRenda1, setMouseOverRenda1] = useState<boolean>(false);
    const [mouseOverRenda2, setMouseOverRenda2] = useState<boolean>(false);
    const [mouseOverRenda3, setMouseOverRenda3] = useState<boolean>(false);
    const [optionSelected, setOptionSelected] = useState<string>('1');
    let optionsChart = {
        chart: {
            height: 500,
            // color: 
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
          },
          tooltip: {
            enabled: false,
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
          colors: ["#e7a86d"]
    }
    let series = [
            {
              name: "series-1",
              data: [31, 40, 28, 51, 42, 109, 100]
            }
          ]

    return (
      <>
        {optionSelected == "1" ? (
          <div className="dark:bg-[#141414]">
            <div className="flex justify-between">
              <div className="flex flex-col justify-evenly items-start">
                <h1 className="font-medium text-4xl dark:text-[#EDEEF0]">Bem-vindo, {userName}</h1>
                <h2 className="font-medium text-xl text-[#5E5F64] dark:text-[#B1B5B7]">
                  Veja sua carteira
                </h2>
              </div>

              <div className="flex flex-col justify-between items-end">
                <div className="flex bg-[#D9D9D9] items-center p-1 rounded-lg w-[60%]">
                  <button
                    className={`flex flex-1 items-center justify-center p-1 rounded-lg ${
                      optionSelected == "1" && "bg-[#FFFFFF]"
                    }`}
                    onClick={() => setOptionSelected("1")}
                  >
                    <p>1</p>
                  </button>
                  <button
                    className={`flex flex-1 items-center justify-center p-1 rounded-lg`}
                    onClick={() => setOptionSelected("2")}
                  >
                    <p>2</p>
                  </button>
                </div>
                <div className="bg-gradient-to-r from-[#FFDFA0] to-[#FDB52A] p-1 rounded-lg mt-4">
                  <span className="font-medium text-xl">Nível Gold</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <h1 className="font-medium text-3xl dark:text-[#EDEEF0]">R$999.999,99</h1>
              <div className="flex gap-1 w-[100%] h-3">
                <div className="flex flex-col w-[60%] items-center">
                  {mouseOverRenda1 && (
                    <div className="absolute mt-3 flex flex-col items-center shadow">
                      <div className=" bg-[#000000] h-3 w-3 rotate-45 translate-y-2 dark:bg-[#EDEEF0]" />
                      <div className=" bg-[#000000] rounded-lg items-center justify-center py-2 px-3 text-[#FFFFFF] dark:bg-[#EDEEF0] dark:text-[#141414]">
                        Renda 1
                      </div>
                    </div>
                  )}
                  <div
                    className="rounded-lg w-[100%] flex-1 bg-green-600"
                    onMouseEnter={() => setMouseOverRenda1(true)}
                    onMouseLeave={() => setMouseOverRenda1(false)}
                  />
                </div>
                <div className="flex flex-col w-[30%] items-center">
                  {mouseOverRenda2 && (
                    <div className="absolute mt-3 flex flex-col items-center shadow">
                      <div className=" bg-[#000000] h-3 w-3 rotate-45 translate-y-2 dark:bg-[#EDEEF0]" />
                      <div className=" bg-[#000000] rounded-lg items-center justify-center py-2 px-3 text-[#FFFFFF] dark:bg-[#EDEEF0] dark:text-[#141414]">
                        Renda 2
                      </div>
                    </div>
                  )}
                  <div
                    className="rounded-lg w-[100%] flex-1 bg-yellow-600"
                    onMouseEnter={() => setMouseOverRenda2(true)}
                    onMouseLeave={() => setMouseOverRenda2(false)}
                  />
                </div>
                <div className="flex flex-col w-[10%] items-center">
                  {mouseOverRenda3 && (
                    <div className="absolute mt-3 flex flex-col items-center shadow">
                      <div className=" bg-[#000000] h-3 w-3 rotate-45 translate-y-2 dark:bg-[#EDEEF0]" />
                      <div className=" bg-[#000000] rounded-lg items-center justify-center py-2 px-3 text-[#FFFFFF] dark:bg-[#EDEEF0] dark:text-[#141414]">
                        Renda 3
                      </div>
                    </div>
                  )}
                  <div
                    className="rounded-lg w-[100%] flex-1 bg-blue-600"
                    onMouseEnter={() => setMouseOverRenda3(true)}
                    onMouseLeave={() => setMouseOverRenda3(false)}
                  />
                </div>
              </div>
              <p className="dark:text-[#B1B5B7]">Continue investindo, realize o seu sonho</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <div className="flex-1 w-[100%]">
                <h2 className="font-bold text-xl">RPM</h2>
                <img src="" alt="" />
              </div>
              <div className="flex bg-[#D9D9D9] items-center p-1 rounded-lg">
                <button
                  className={`flex flex-1 items-center justify-center py-1 px-2 aspect-square rounded-lg ${
                    optionSelected == "1" && "bg-[#FFFFFF]"
                  }`}
                  onClick={() => setOptionSelected("1")}
                >
                  <p>1</p>
                </button>
                <button
                  className={`flex flex-1 items-center justify-center py-1 px-2 rounded-lg aspect-square bg-[#FFFFFF]`}
                  onClick={() => setOptionSelected("2")}
                >
                  <p>2</p>
                </button>
              </div>
            </div>
            <div className="flex-1">
              <Chart
                // @ts-ignore
                options={optionsChart}
                series={series}
                type="area"
                width="100%"
                height="150"
              />
            </div>
          </div>
        )}
      </>
    );
}