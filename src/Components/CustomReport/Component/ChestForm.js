const ChestForm = ({ form }) => {
    switch (form.type) {
        case 'select':
            return <>select</>
        default:
            return <>default</>
    }
}

export default ChestForm
