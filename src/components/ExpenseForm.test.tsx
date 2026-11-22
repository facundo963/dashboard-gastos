import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ExpenseForm } from './ExpenseForm';

describe('ExpenseForm', () => {
  it('muestra errores y no envía si faltan datos', async () => {
    const onSubmit = vi.fn();
    render(<ExpenseForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Agregar gasto' }));

    expect(screen.getByText('Ingresá un monto mayor a cero.')).toBeInTheDocument();
    expect(screen.getByLabelText('Monto')).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envía el gasto con el monto en formato argentino', async () => {
    const onSubmit = vi.fn();
    render(<ExpenseForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Monto'), '12.500,50');
    await userEvent.type(screen.getByLabelText('Descripción'), 'Supermercado');
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'hogar');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar gasto' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 12500.5, description: 'Supermercado', category: 'hogar' }),
    );
    expect(screen.getByLabelText('Monto')).toHaveValue('');
  });

  it('precarga los datos en modo edición', () => {
    render(
      <ExpenseForm
        editing={{ id: '1', amount: 980.5, category: 'ocio', description: 'Cine', date: '2026-11-02' }}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('Monto')).toHaveValue('980,5');
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument();
  });
});
