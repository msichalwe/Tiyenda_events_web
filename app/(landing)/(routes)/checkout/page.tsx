'use client'
import { useState } from 'react';

const CheckoutPage = () => {
    const [paymentMethod, setPaymentMethod] = useState<string>('card');
    const [mobileMoneyProvider, setMobileMoneyProvider] = useState<string>('airtel');
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [userPhone, setUserPhone] = useState<string>('');

    const [cardType, setCardType] = useState<string>('');

    const handlePayment = () => {
        // Handle the payment logic here
        alert(`Payment method: ${paymentMethod}\nMobile Money Provider: ${mobileMoneyProvider}\nName: ${userName}\nEmail: ${userEmail}\nPhone: ${userPhone}`);
    };

    return (
        <div className="font-[sans-serif] lg:flex lg:items-center lg:justify-center lg:h-screen max-lg:py-4">
            <div className="bg-white-100 p-8 w-full max-w-5xl max-lg:max-w-xl mx-auto rounded-md">
                <h2 className="text-3xl font-extrabold text-gray-800 text-center">Checkout</h2>

                <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-800">Your Details</h3>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={userPhone}
                                onChange={(e) => setUserPhone(e.target.value)}
                                className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 max-lg:gap-8 mt-16">
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold text-gray-800">Choose your payment method</h3>

                        <div className="grid gap-4 sm:grid-cols-2 mt-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    className="w-5 h-5 cursor-pointer"
                                    id="card"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="card" className="ml-4 flex gap-2 cursor-pointer">
                                    <img src="https://readymadeui.com/images/visa.webp" className="w-12" alt="card1" />
                                    <img src="https://readymadeui.com/images/master.webp" className="w-12" alt="card3" />
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    className="w-5 h-5 cursor-pointer"
                                    id="mobileMoney"
                                    name="paymentMethod"
                                    value="mobileMoney"
                                    checked={paymentMethod === 'mobileMoney'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="mobileMoney" className="ml-4 flex gap-2 cursor-pointer">
                                    <span>Mobile Money</span>
                                </label>
                            </div>
                        </div>

                        {paymentMethod === 'card' && (
                            <form className="mt-8">
                                <div className="grid sm:col-span-2 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Name of card holder"
                                            className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="Postal code"
                                            className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="Card number"
                                            className="col-span-full px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                                            onChange={(e) => {
                                                const cardNumber = e.target.value;
                                                if (cardNumber.startsWith('4')) {
                                                    // Visa
                                                    setCardType('Visa');
                                                } else if (cardNumber.startsWith('51') || cardNumber.startsWith('52') || cardNumber.startsWith('53') || cardNumber.startsWith('54') || cardNumber.startsWith('55')) {
                                                    // Mastercard
                                                    setCardType('Mastercard');
                                                } else {
                                                    setCardType('');
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="EXP."
                                            className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="CVV"
                                            className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                                        />
                                    </div>
                                </div>



                                {cardType && (
                                    <div className="mt-4">
                                        <img
                                            src={
                                                cardType === 'Visa'
                                                    ? 'https://readymadeui.com/images/visa.webp'
                                                    : 'https://readymadeui.com/images/master.webp'
                                            }
                                            alt={cardType}
                                            className="w-12"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-4 mt-8">
                                    <button type="button" className="px-7 py-3.5 text-sm tracking-wide bg-white hover:bg-gray-50 text-gray-800 rounded-md">
                                        Pay later
                                    </button>
                                    <button type="button" onClick={handlePayment} className="px-7 py-3.5 text-sm tracking-wide bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        )}

                        {paymentMethod === 'mobileMoney' && (
                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-800">Choose your Mobile Money provider</h3>
                                <div className="grid gap-4 sm:grid-cols-3 mt-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            className="w-5 h-5 cursor-pointer"
                                            id="airtel"
                                            name="mobileMoneyProvider"
                                            value="airtel"
                                            checked={mobileMoneyProvider === 'airtel'}
                                            onChange={(e) => setMobileMoneyProvider(e.target.value)}
                                        />
                                        <label htmlFor="airtel" className="ml-4 flex gap-2 cursor-pointer">
                                            <span>Airtel</span>
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            className="w-5 h-5 cursor-pointer"
                                            id="mtn"
                                            name="mobileMoneyProvider"
                                            value="mtn"
                                            checked={mobileMoneyProvider === 'mtn'}
                                            onChange={(e) => setMobileMoneyProvider(e.target.value)}
                                        />
                                        <label htmlFor="mtn" className="ml-4 flex gap-2 cursor-pointer">
                                            <span>MTN</span>
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            className="w-5 h-5 cursor-pointer"
                                            id="zamtel"
                                            name="mobileMoneyProvider"
                                            value="zamtel"
                                            checked={mobileMoneyProvider === 'zamtel'}
                                            onChange={(e) => setMobileMoneyProvider(e.target.value)}
                                        />
                                        <label htmlFor="zamtel" className="ml-4 flex gap-2 cursor-pointer">
                                            <span>Zamtel</span>
                                        </label>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            value={userPhone}
                                            onChange={(e) => setUserPhone(e.target.value)}
                                            className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                                        />
                                    </div>


                                </div>
                                <div className="flex flex-wrap gap-4 mt-8">
                                    <button type="button"
                                            className="px-7 py-3.5 text-sm tracking-wide bg-white hover:bg-gray-50 text-gray-800 rounded-md">
                                        Pay later
                                    </button>
                                    <button type="button" onClick={handlePayment}
                                            className="px-7 py-3.5 text-sm tracking-wide bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-md max-lg:-order-1">
                        <h3 className="text-lg font-bold text-gray-800">Summary</h3>
                        <ul className="text-gray-800 mt-6 space-y-3">
                            <li className="flex flex-wrap gap-4 text-sm">
                                Sub total <span className="ml-auto font-bold">K48.00</span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Discount (20%) <span className="ml-auto font-bold">K4.00</span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Tax <span className="ml-auto font-bold">K4.00</span>
                            </li>
                            <hr />
                            <li className="flex flex-wrap gap-4 text-base font-bold">
                                Total <span className="ml-auto">$52.00</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
