import React from 'react'
import { Dispatch, SetStateAction } from 'react'
interface Props {
    currentPage: number,
    setCurrentPage: Dispatch<SetStateAction<number>>,
    totalNumberOfPages: number,
}
export default function TablePagination({ currentPage, setCurrentPage, totalNumberOfPages }: Props) {
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
        <nav className="pagination__nav">
            <ul className="pagination__list">
                <li onClick={decreasePageNumber} className="pagination__item">
                    <a>Prev</a>
                </li>
                {numbersArray.map((n, i) =>
                    <li onClick={() => setCurrentPage(n)}
                        className={`pagination__item ${currentPage == n ? "active__pagination__item" : ""}`} key={i}>
                        <a>{n}</a>
                    </li>)}
                <li onClick={increasePageNumber} className="pagination__item">
                    <a >Next</a>
                </li>
            </ul>
        </nav>
    )
}
