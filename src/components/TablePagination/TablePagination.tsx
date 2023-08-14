import React from 'react'
import "./TablePagination.css"
import { Dispatch, SetStateAction } from 'react'
import { GrFormNext, GrFormPrevious, } from 'react-icons/gr'
interface Props {
    currentPage: number,
    setCurrentPage: Dispatch<SetStateAction<number>>,
    totalNumberOfPages: number,
    type: "group" | "task"
}
export default function TablePagination({ type, currentPage, setCurrentPage, totalNumberOfPages }: Props) {
    const numbersArray: number[] = Array.from({ length: totalNumberOfPages }, (v, i) => i + 1)

    const increasePageNumber = () => {
        if (currentPage < totalNumberOfPages) {
            setCurrentPage((prevState) => prevState + 1)
        }
    }

    const decreasePageNumber = () => {
        if (currentPage > 1) {
            setCurrentPage((prevState) => prevState - 1)
        }
    }


    return (
        <nav className={`pagination__nav ${type}__pagination`}>
            <ul className="pagination__list">
                <li onClick={decreasePageNumber} className="pagination__item">
                    <a className="prev__link pagination__link"><GrFormPrevious color="white" /></a>
                </li>
                <div className="pagination__numbers">
                    {numbersArray.map((n, i) =>
                        <li onClick={() => setCurrentPage(n)}
                            className={`pagination__item`} key={i}>
                            <a className={`pagination__link ${currentPage == n ? "active__pagination__item" : ""}`}>{n}</a>
                        </li>)}
                </div>

                <li onClick={increasePageNumber} className="pagination__item">
                    <a className="pagination__link"><GrFormNext className="gr" /></a>
                </li>
            </ul>
        </nav>
    )
}
