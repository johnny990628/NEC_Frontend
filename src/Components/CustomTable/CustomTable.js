import React, { Fragment, useState, useEffect } from 'react'
import {
    Box,
    Button,
    ButtonGroup,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    CircularProgress,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material'
import { useTheme } from '@mui/styles'
import { Search, ArrowDropUp, ArrowDropDown } from '@mui/icons-material'
import { useTable, useGlobalFilter, usePagination, useSortBy, useExpanded } from 'react-table'
import { useDebouncedCallback } from 'use-debounce'
import useStyles from './Style'

import CustomScrollbar from '../CustomScrollbar/CustomScrollbar'
import CustomTableSetting from '../CustomTableForm/CustomTableSetting'
import DateRanger from '../DateRanger/DateRanger'
import { addDays, parseISO } from 'date-fns'

const CustomTable = ({
    columns,
    renderSubRow,
    fetchData,
    data,
    loading,
    totalPage,
    totalCount,
    GlobalFilter,
    GlobalFilterParams,
    filterParams,
    originalColumns,
    setColumns,
}) => {
    const [search, setSearch] = useState({})

    const [dateRange, setDateRange] = useState({ from: parseISO('1900-01-01'), to: addDays(new Date(), 1) })

    const classes = useStyles()
    const theme = useTheme()

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,

        state: { pageIndex, pageSize, sortBy },
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        visibleColumns,
    } = useTable(
        {
            columns,
            data,
            initialState: {
                sortBy: [{ id: 'createdAt', desc: true }],
                pageIndex: 0,
            },
            manualPagination: true,
            pageCount: totalPage,
            autoResetSortBy: false,
            autoResetPage: true,
            autoResetFilters: false,
        },
        useGlobalFilter,
        useSortBy,
        useExpanded,
        usePagination
    )

    useEffect(() => {
        fetchData({
            limit: pageSize,
            offset: pageIndex,
            ...search,
            dateRange,
            sort: sortBy[0]?.id,
            desc: sortBy[0]?.desc ? -1 : 1,
        })
    }, [pageIndex, pageSize, search, sortBy, totalCount, dateRange])

    const TablePagination = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'right',
                    alignItems: 'center',
                    color: 'text.gray',
                }}
            >
                <Box className={classes.tableFooterItem} sx={{ fontSize: '1.1rem' }}>
                    {`第${pageIndex + 1}/${pageOptions.length}頁`}
                </Box>
                <ButtonGroup variant="outlined" className={classes.tableFooterItem}>
                    <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </Button>
                    <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </Button>
                    <Button onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </Button>
                    <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </Button>
                </ButtonGroup>
            </Box>
        )
    }

    return (
        <Grid container direction="column" wrap="nowrap" className={classes.container}>
            <Grid
                container
                item
                xs={1}
                sx={{
                    p: 1,
                    mb: 2,
                }}
            >
                {GlobalFilter && (
                    <Grid item xs={6}>
                        <GlobalFilter setSearch={setSearch} search={search} totalCount={totalCount} loading={loading} />
                    </Grid>
                )}
                {GlobalFilterParams && (
                    <Grid item xs={12}>
                        <GlobalFilterParams
                            setSearch={setSearch}
                            search={search}
                            totalCount={totalCount}
                            loading={loading}
                            filterParams={filterParams}
                            setColumns={setColumns}
                            columns={originalColumns}
                        />
                    </Grid>
                )}

                <Grid item xs={6} display="flex" justifyContent="flex-end" alignItems="center">
                    <Box>
                        <DateRanger setDateRange={setDateRange} />
                    </Box>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="rows">列數</InputLabel>
                        <Select
                            labelId="rows"
                            label="列數"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value))
                            }}
                            className={classes.tableFooterItem}
                            sx={{ color: 'text.gray' }}
                        >
                            {[5, 10, 20, 30, 40].map((pageSize) => (
                                <MenuItem key={pageSize} value={pageSize}>
                                    {pageSize}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item xs={9} {...getTableProps()} className={classes.tableBody}>
                <CustomScrollbar>
                    <Table stickyHeader>
                        <TableHead>
                            {headerGroups.map((headerGroup) => (
                                <TableRow {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <TableCell
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className={classes.tableHeader}
                                        >
                                            <Box className={classes.headerFont} sx={{ display: 'flex' }}>
                                                {column.render('Header')}
                                                <Box>
                                                    {column.isSorted ? (
                                                        column.isSortedDesc ? (
                                                            <ArrowDropDown />
                                                        ) : (
                                                            <ArrowDropUp />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>

                        <TableBody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row)
                                return (
                                    <Fragment key={row.getRowProps().key}>
                                        <TableRow {...row.getRowProps()} className={classes.tableRow}>
                                            {row.cells.map((cell) => (
                                                <TableCell
                                                    {...cell.getCellProps()}
                                                    className={classes.tableCell}
                                                    sx={{
                                                        fontSize: '1rem',
                                                        [theme.breakpoints.down('lg')]: {
                                                            fontSize: '.9rem',
                                                        },
                                                    }}
                                                >
                                                    {cell.render('Cell')}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        {row.isExpanded ? (
                                            <TableRow>
                                                <TableCell colSpan={visibleColumns.length}>
                                                    {renderSubRow({ row })}
                                                </TableCell>
                                            </TableRow>
                                        ) : null}
                                    </Fragment>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CustomScrollbar>
            </Grid>

            <Box sx={{ pt: 2 }}>
                <TablePagination />
            </Box>
        </Grid>
    )
}

export default CustomTable
