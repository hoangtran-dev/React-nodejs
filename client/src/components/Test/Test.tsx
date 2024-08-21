import { useFieldArray, useForm } from 'react-hook-form';

function DynamicInputForm() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      inputs: [{ value: '' }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inputs'
  });

  const onSubmit = (data:any) => {
    console.log(data.inputs);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((item, index) => (
        <div key={item.id}>
          <input 
            {...register(`inputs.${index}.value`)} 
            defaultValue={item.value}
          />
          <button type="button" onClick={() => remove(index)}>Xóa</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ value: '' })}>Add Input</button>
      <button type="submit">Submit</button>
    </form>
  );
}

export default DynamicInputForm;
