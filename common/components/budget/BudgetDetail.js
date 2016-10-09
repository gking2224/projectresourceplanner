import React from 'react'
import { EditableInput, LabelledField } from '../widgets'

const BudgetDetail = ({project, readonly, nameUpdated, yearUpdated, budget}) => {

  return (
    <div>
      <h2>Budget Detail</h2>
      <LabelledField small label={'Project'}>
        <EditableInput initialContent={project.name} initialReadonly allowInlineEdit={false} />
      </LabelledField>
      <LabelledField small label={'Year'}>
        <EditableInput initialContent={budget.year}
                       onComplete={yearUpdated}
                       allowInlineEdit={!readonly}
        />
      </LabelledField>
      <LabelledField small label={'Name'}>
        <EditableInput initialContent={budget.name}
                       onComplete={nameUpdated}
                       allowInlineEdit={!readonly}
        />
      </LabelledField>
    </div>
  )
}

export default BudgetDetail
