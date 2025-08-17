import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './App.css';

const App = () => {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercentage, setTipPercentage] = useState('15');
  const [results, setResults] = useState({ tip: 0, total: 0 });

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: '⚠️ Error de Validación',
      text: message,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#007bff',
      background: '#fff',
      backdrop: `
        rgba(0,0,123,0.4)
        url("/images/nyancat.gif")
        left top
        no-repeat
      `
    });
  };

  const showSuccessAlert = (tipAmount, totalAmount, percentage) => {
    Swal.fire({
      icon: 'success',
      title: '✅ ¡Cálculo Exitoso!',
      html: `
        <div style="text-align: center; font-size: 16px;">
          <p><strong>Propina (${percentage}%):</strong> <span style="color: #28a745; font-size: 18px; font-weight: bold;">${tipAmount.toFixed(2)}</span></p>
          <p><strong>Total a pagar:</strong> <span style="color: #007bff; font-size: 20px; font-weight: bold;">${totalAmount.toFixed(2)}</span></p>
          <hr>
          <small style="color: #6c757d;">¡Listo para entregar al cliente! 🍽️</small>
        </div>
      `,
      confirmButtonText: '¡Perfecto!',
      confirmButtonColor: '#28a745',
      background: '#fff',
      showClass: {
        popup: 'animate__animated animate__fadeInUp'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown'
      }
    });
  };

  const validateInput = (value) => {
    if (!value || value.trim() === '') {
      showErrorAlert('Por favor ingresa el monto de la cuenta');
      return false;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      showErrorAlert('Por favor ingresa un número válido');
      return false;
    }
    
    if (numValue <= 0) {
      showErrorAlert('El monto debe ser mayor a cero');
      return false;
    }
    
    if (numValue > 999999) {
      showErrorAlert('El monto es demasiado alto (máximo $999,999)');
      return false;
    }
    
    return true;
  };

  const calculateTip = () => {
    if (!validateInput(billAmount)) {
      setResults({ tip: 0, total: 0 });
      return;
    }

    const bill = parseFloat(billAmount);
    const tipPercent = parseFloat(tipPercentage);
    const tipAmount = (bill * tipPercent) / 100;
    const totalAmount = bill + tipAmount;

    setResults({
      tip: tipAmount,
      total: totalAmount
    });

    showSuccessAlert(tipAmount, totalAmount, tipPercentage);
  };

  const resetCalculator = () => {
    Swal.fire({
      title: '🔄 ¿Limpiar calculadora?',
      text: 'Esto borrará todos los datos ingresados',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setBillAmount('');
        setTipPercentage('15');
        setResults({ tip: 0, total: 0 });
        
        Swal.fire({
          title: '✨ ¡Limpiado!',
          text: 'La calculadora está lista para un nuevo cálculo',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#fff'
        });
      }
    });
  };

  const handleBillChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBillAmount(value);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0">
                <i className="fas fa-calculator me-2"></i>
                Calculadora de Propinas
              </h3>
              <p className="mb-0 mt-2">Herramienta para Sofía</p>
            </div>
            
            <div className="card-body p-4">
              <div>
                <div className="mb-4">
                  <label htmlFor="billAmount" className="form-label fw-bold">
                    <i className="fas fa-dollar-sign me-2"></i>
                    Monto de la Cuenta
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">$</span>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="billAmount"
                      placeholder="0.00"
                      value={billAmount}
                      onChange={handleBillChange}
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-text">Ingresa el total de la cuenta sin propina</div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="fas fa-percentage me-2"></i>
                    Porcentaje de Propina
                  </label>
                  <div className="row g-2">
                    {['10', '15', '18', '20', '25'].map((percent) => (
                      <div key={percent} className="col">
                        <input
                          type="radio"
                          className="btn-check"
                          name="tipPercentage"
                          id={`tip${percent}`}
                          value={percent}
                          checked={tipPercentage === percent}
                          onChange={(e) => setTipPercentage(e.target.value)}
                        />
                        <label 
                          className="btn btn-outline-primary w-100" 
                          htmlFor={`tip${percent}`}
                        >
                          {percent}%
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-grid gap-2 mb-4">
                  <button 
                    type="button" 
                    className="btn btn-primary btn-lg"
                    onClick={calculateTip}
                  >
                    <i className="fas fa-calculator me-2"></i>
                    Calcular Propina
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={resetCalculator}
                  >
                    <i className="fas fa-redo me-2"></i>
                    Limpiar
                  </button>
                </div>
              </div>

              {(results.tip > 0 || results.total > 0) && (
                <div className="card bg-light">
                  <div className="card-body">
                    <h5 className="card-title text-center mb-3">
                      <i className="fas fa-receipt me-2"></i>
                      Resultados
                    </h5>
                    <div className="row text-center">
                      <div className="col-6">
                        <div className="border-end">
                          <h4 className="text-success mb-1">${results.tip.toFixed(2)}</h4>
                          <small className="text-muted">Propina ({tipPercentage}%)</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <h4 className="text-primary mb-1">${results.total.toFixed(2)}</h4>
                        <small className="text-muted">Total a Pagar</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="card-footer text-center text-muted">
              <small>
                <i className="fas fa-heart text-danger me-1"></i>
                Hecha especialmente para Sofía
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;