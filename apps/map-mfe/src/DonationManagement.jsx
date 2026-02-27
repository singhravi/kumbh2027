import React, { useState } from 'react';
import './DonationManagement.css';

export default function DonationManagement() {
    const [activeTab, setActiveTab] = useState('money'); // money, goods, receipts
    const [message, setMessage] = useState('');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success

    // Form States
    const [moneyData, setMoneyData] = useState({
        donorName: '',
        contactPhone: '',
        amount: '',
        paymentMethod: 'cash', // cash, upi, cheque
        referenceNumber: '', // for UPI/Cheque
        purpose: 'general'
    });

    const [goodsData, setGoodsData] = useState({
        donorName: '',
        contactPhone: '',
        category: 'ration', // ration, vegetables, clothes, medical, other
        estimatedValue: '',
        items: ''
    });

    // Mock Database
    const [donationsLog, setDonationsLog] = useState([
        { id: 'DN-M-001', type: 'Money', donor: 'Ramesh Singh', date: '2026-02-27', details: '₹5000 (UPI) - General', status: 'Received' },
        { id: 'DN-G-102', type: 'Goods', donor: 'Local Market Assoc', date: '2026-02-26', details: 'Vegetables (500kg)', status: 'Received' }
    ]);

    const [receiptPreview, setReceiptPreview] = useState(null);

    const handleMoneySubmit = (e) => {
        e.preventDefault();

        if (['upi', 'netbanking', 'credit_card', 'debit_card'].includes(moneyData.paymentMethod)) {
            setIsPaymentModalOpen(true);
            setPaymentStatus('pending');
            return;
        }

        processFinalDonation(moneyData.referenceNumber);
    };

    const processFinalDonation = (refNum = '') => {
        const newId = `DN-M-00${donationsLog.length + 1}`;
        const newLog = {
            id: newId,
            type: 'Money',
            donor: moneyData.donorName,
            date: new Date().toISOString().split('T')[0],
            details: `₹${moneyData.amount} (${moneyData.paymentMethod.replace('_', ' ').toUpperCase()}) - ${moneyData.purpose}`,
            status: 'Received',
            raw: { ...moneyData, referenceNumber: refNum, date: new Date().toLocaleString() }
        };

        setDonationsLog([newLog, ...donationsLog]);
        setMessage(`Donation of ₹${moneyData.amount} recorded successfully!`);

        setReceiptPreview(newLog);
        setActiveTab('receipts');
        setIsPaymentModalOpen(false);

        setMoneyData({ donorName: '', contactPhone: '', amount: '', paymentMethod: 'cash', referenceNumber: '', purpose: 'general' });
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSimulatePayment = () => {
        setPaymentStatus('processing');
        setTimeout(() => {
            setPaymentStatus('success');
            setTimeout(() => {
                const mockRef = `TXN${Math.floor(Math.random() * 10000000000)}`;
                processFinalDonation(mockRef);
            }, 1000);
        }, 2000);
    };

    const handleGoodsSubmit = (e) => {
        e.preventDefault();
        const newId = `DN-G-10${donationsLog.length + 1}`;
        const newLog = {
            id: newId,
            type: 'Goods',
            donor: goodsData.donorName,
            date: new Date().toISOString().split('T')[0],
            details: `${goodsData.category.toUpperCase()} - ${goodsData.items}`,
            status: 'Received',
            raw: { ...goodsData, date: new Date().toLocaleString() }
        };

        setDonationsLog([newLog, ...donationsLog]);
        setMessage('Goods donation recorded successfully!');

        setReceiptPreview(newLog);
        setActiveTab('receipts');

        setGoodsData({ donorName: '', contactPhone: '', category: 'ration', estimatedValue: '', items: '' });
        setTimeout(() => setMessage(''), 3000);
    };

    const renderMoneyTab = () => (
        <div className="donation-panel">
            <div className="form-section">
                <h3>Record Financial Donation</h3>
                <form onSubmit={handleMoneySubmit} className="donation-form">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Donor Name / Organization *</label>
                            <input type="text" placeholder="Full Name" value={moneyData.donorName} onChange={e => setMoneyData({ ...moneyData, donorName: e.target.value })} required />
                        </div>
                        <div className="form-group half">
                            <label>Contact Phone</label>
                            <input type="tel" placeholder="Mobile Number" value={moneyData.contactPhone} onChange={e => setMoneyData({ ...moneyData, contactPhone: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Amount (₹) *</label>
                            <input type="number" placeholder="0.00" value={moneyData.amount} onChange={e => setMoneyData({ ...moneyData, amount: e.target.value })} required min="1" />
                        </div>
                        <div className="form-group half">
                            <label>Payment Method *</label>
                            <select value={moneyData.paymentMethod} onChange={e => setMoneyData({ ...moneyData, paymentMethod: e.target.value })} required>
                                <option value="cash">Cash</option>
                                <option value="upi">UPI</option>
                                <option value="netbanking">Net Banking</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="debit_card">Debit Card</option>
                                <option value="cheque">Cheque</option>
                                <option value="dd">Demand Draft</option>
                            </select>
                        </div>
                    </div>

                    {['cheque', 'dd'].includes(moneyData.paymentMethod) && (
                        <div className="form-group full-width">
                            <label>Cheque / DD Number *</label>
                            <input type="text" placeholder="Enter instrument number" value={moneyData.referenceNumber} onChange={e => setMoneyData({ ...moneyData, referenceNumber: e.target.value })} required />
                        </div>
                    )}

                    <div className="form-group full-width">
                        <label>Purpose / Fund Name</label>
                        <select value={moneyData.purpose} onChange={e => setMoneyData({ ...moneyData, purpose: e.target.value })}>
                            <option value="general">General Mela Fund</option>
                            <option value="food">Anna Daan (Food/Kitchen)</option>
                            <option value="medical">Medical / Health Camp</option>
                            <option value="sanitation">Sanitation & Cleaning</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary">Process Donation & Generate Receipt</button>
                </form>
            </div>
        </div>
    );

    const renderGoodsTab = () => (
        <div className="donation-panel">
            <div className="form-section">
                <h3>Record Goods / In-Kind Donation</h3>
                <form onSubmit={handleGoodsSubmit} className="donation-form">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Donor Name / Organization *</label>
                            <input type="text" placeholder="Full Name" value={goodsData.donorName} onChange={e => setGoodsData({ ...goodsData, donorName: e.target.value })} required />
                        </div>
                        <div className="form-group half">
                            <label>Contact Phone</label>
                            <input type="tel" placeholder="Mobile Number" value={goodsData.contactPhone} onChange={e => setGoodsData({ ...goodsData, contactPhone: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Category *</label>
                            <select value={goodsData.category} onChange={e => setGoodsData({ ...goodsData, category: e.target.value })} required>
                                <option value="ration">Ration / Dry Groceries</option>
                                <option value="vegetables">Fresh Vegetables / Fruits</option>
                                <option value="clothes">Blankets / Clothes</option>
                                <option value="medical">Medicines / First Aid</option>
                                <option value="other">Other Supplies</option>
                            </select>
                        </div>
                        <div className="form-group half">
                            <label>Estimated Value (₹) - Optional</label>
                            <input type="number" placeholder="0.00" value={goodsData.estimatedValue} onChange={e => setGoodsData({ ...goodsData, estimatedValue: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Items Description & Quantities *</label>
                        <textarea
                            placeholder="e.g. 500kg Potatoes, 200kg Onions, 50 Liters Mustard Oil"
                            rows="4"
                            value={goodsData.items}
                            onChange={e => setGoodsData({ ...goodsData, items: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-primary">Process Goods & Generate Acknowledgement</button>
                </form>
            </div>
        </div>
    );

    const renderReceiptsTab = () => (
        <div className="donation-panel split-layout">
            <div className="registry-section">
                <h3>Donation Registry</h3>
                <div className="registry-table-container">
                    <table className="donation-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Donor</th>
                                <th>Type & Details</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donationsLog.map(log => (
                                <tr key={log.id} onClick={() => setReceiptPreview(log)} className={receiptPreview?.id === log.id ? 'selected-row' : ''}>
                                    <td><strong>{log.id}</strong></td>
                                    <td>{log.donor}</td>
                                    <td>
                                        <span className={`type-badge ${log.type.toLowerCase()}`}>{log.type}</span>
                                        <div className="small-details">{log.details}</div>
                                    </td>
                                    <td>{log.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="receipt-preview-section">
                <h3>Receipt Preview</h3>
                {receiptPreview ? (
                    <div className="receipt-card">
                        <div className="receipt-header">
                            <h2>KUMBH MELA 2027</h2>
                            <p>Official Donation {receiptPreview.type === 'Money' ? 'Receipt' : 'Acknowledgement'}</p>
                            <div className="receipt-no">No: {receiptPreview.id}</div>
                        </div>

                        <div className="receipt-body">
                            <div className="receipt-date">Date: {receiptPreview.raw?.date || receiptPreview.date}</div>

                            <div className="receipt-text">
                                Received with thanks from <strong>{receiptPreview.donor}</strong>
                                {receiptPreview.type === 'Money' ? (
                                    <>
                                        <br /><br />
                                        the sum of <strong className="highlight-amount">₹{receiptPreview.raw?.amount}</strong>
                                        &nbsp;via <span>{receiptPreview.raw?.paymentMethod?.toUpperCase() || 'CASH'}</span>
                                        {receiptPreview.raw?.referenceNumber && ` (Ref: ${receiptPreview.raw.referenceNumber})`}
                                        <br /><br />
                                        towards <strong>{receiptPreview.raw?.purpose?.toUpperCase() || 'GENERAL FUND'}</strong>.
                                    </>
                                ) : (
                                    <>
                                        <br /><br />
                                        the following goods / items in kind:
                                        <div className="goods-list-box">
                                            <strong>Category:</strong> {receiptPreview.raw?.category?.toUpperCase()}
                                            <p>{receiptPreview.raw?.items || receiptPreview.details}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="receipt-footer">
                            <div className="signature-block">
                                <div className="line"></div>
                                <p>Authorized Signatory</p>
                            </div>
                            <div className="tax-note">
                                * Donations to Kumbh Mela Authority are exempt under Section 80G.
                            </div>
                        </div>

                        <div className="receipt-actions no-print">
                            <button className="btn-outline" onClick={() => window.print()}>🖨️ Print Receipt</button>
                            <button className="btn-secondary">✉️ Email / SMS to Donor</button>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>Select a donation from the registry to view or print its receipt.</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="donation-container">
            <div className="donation-header">
                <h2>Donation Management</h2>
                <p>Record financial contributions and in-kind goods donations</p>
            </div>

            {message && <div className="status-message success">{message}</div>}

            <div className="donation-tabs-nav">
                <button
                    className={`donation-tab-btn ${activeTab === 'money' ? 'active' : ''}`}
                    onClick={() => setActiveTab('money')}
                >
                    Financial Donations (Money)
                </button>
                <button
                    className={`donation-tab-btn ${activeTab === 'goods' ? 'active' : ''}`}
                    onClick={() => setActiveTab('goods')}
                >
                    In-Kind Donations (Goods/Ration)
                </button>
                <button
                    className={`donation-tab-btn ${activeTab === 'receipts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('receipts')}
                >
                    Receipts & Registry
                </button>
            </div>

            <div className="donation-tab-content">
                {activeTab === 'money' && renderMoneyTab()}
                {activeTab === 'goods' && renderGoodsTab()}
                {activeTab === 'receipts' && renderReceiptsTab()}
            </div>

            {isPaymentModalOpen && (
                <div className="payment-modal-overlay">
                    <div className="payment-modal">
                        <div className="payment-modal-header">
                            <h3>Secure Payment Gateway</h3>
                            <button className="close-btn" onClick={() => setIsPaymentModalOpen(false)} disabled={paymentStatus === 'processing'}>✕</button>
                        </div>
                        <div className="payment-modal-body">
                            <div className="payment-summary">
                                <p>Paying to: <strong>Kumbh Mela Donation Fund</strong></p>
                                <h2>₹{moneyData.amount}</h2>
                                <p>Method: {moneyData.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                            </div>

                            {paymentStatus === 'pending' && (
                                <div className="payment-actions">
                                    <button className="btn-primary" onClick={handleSimulatePayment}>Simulate Payment</button>
                                </div>
                            )}

                            {paymentStatus === 'processing' && (
                                <div className="payment-processing">
                                    <div className="spinner"></div>
                                    <p>Processing transaction securely...</p>
                                </div>
                            )}

                            {paymentStatus === 'success' && (
                                <div className="payment-success">
                                    <div className="success-icon">✓</div>
                                    <p>Payment Successful!</p>
                                    <p>Generating receipt...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
