import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, ArrowLeft, Clock, MapPin } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { supabase } from '../lib/supabase';

export default function OrderTracking() {
  const { id } = useParams();
  const orderId = id || "ORD-847291";
  
  const [order, setOrder] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      const { data } = await supabase.from('orders').select('*').eq('id', orderId).single();
      if (data) setOrder(data);
    }
    fetchOrder();
  }, [orderId]);

  const statusToStep = {
    'Pending': 0,
    'Processing': 1,
    'Shipped': 2,
    'Out for Delivery': 3,
    'Delivered': 4,
    'Cancelled': -1
  };
  
  const currentStepIndex = order ? (statusToStep[order.status] ?? 0) : 0;
  const orderDate = order ? new Date(order.date) : new Date();

  const processingDate = order?.processing_date ? new Date(order.processing_date) : null;
  const shippedDate = order?.shipped_date ? new Date(order.shipped_date) : null;
  const outForDeliveryDate = order?.out_for_delivery_date ? new Date(order.out_for_delivery_date) : null;
  const deliveredDate = order?.delivered_date ? new Date(order.delivered_date) : null;
  
  // For Out for Delivery, we can estimate it based on shippedDate if available and if it hasn't actually reached that status yet
  const outForDeliveryEst = shippedDate ? addDays(shippedDate, 2) : addDays(orderDate, 4);

  const steps = [
    { 
      title: "Order Placed", 
      date: format(orderDate, "MMM dd, yyyy - hh:mm a"), 
      description: "We have received your order.", 
      icon: Package, 
      completed: currentStepIndex >= 0 
    },
    { 
      title: "Processing", 
      date: processingDate ? format(processingDate, "MMM dd, yyyy - hh:mm a") : "Pending", 
      description: "Your order is being prepared and packed.", 
      icon: Clock, 
      completed: currentStepIndex >= 1 
    },
    { 
      title: "Shipped", 
      date: shippedDate ? format(shippedDate, "MMM dd, yyyy - hh:mm a") : "Pending", 
      description: "Your package has been handed over to the courier.", 
      icon: Truck, 
      completed: currentStepIndex >= 2 
    },
    { 
      title: "Out for Delivery", 
      date: outForDeliveryDate ? format(outForDeliveryDate, "MMM dd, yyyy - hh:mm a") : `Expected ${format(outForDeliveryEst, "MMM dd")}`, 
      description: "The courier is on their way to your address.", 
      icon: MapPin, 
      completed: currentStepIndex >= 3 
    },
    { 
      title: "Delivered", 
      date: deliveredDate ? format(deliveredDate, "MMM dd, yyyy - hh:mm a") : "Pending", 
      description: "Package arrived at final destination.", 
      icon: CheckCircle, 
      completed: currentStepIndex >= 4 
    },
  ];

  const activeStep = steps.findLastIndex(s => s.completed);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/profile" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="bg-white rounded-2xl border border-border p-6 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Track Order</h1>
            <p className="text-gray-500 mt-1">Order #{orderId}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-gray-500">Estimated Delivery</p>
            <p className="text-xl font-bold text-primary">{format(addDays(orderDate, 4), "MMMM dd, yyyy")}</p>
          </div>
        </div>

        {/* Courier Info */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl mb-10">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 text-blue-500 shadow-sm">
            <Truck size={24} />
          </div>
          <div>
            <p className="font-bold text-gray-900">Elevate Express Courier</p>
            <p className="text-sm text-gray-500">Tracking Number: {order ? `ELV-${order.id.replace(/\D/g, '').substring(0,8) || '88329100'}` : 'ELV-883291004'}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-8 md:pl-0">
          {/* Vertical Line for mobile */}
          <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-gray-100 md:hidden z-0"></div>

          <div className="flex flex-col md:flex-row justify-between relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = idx === activeStep;
              
              return (
                <div key={idx} className="flex md:flex-col items-start md:items-center relative mb-8 md:mb-0 w-full md:w-1/5">
                  {/* Connecting Line for desktop */}
                  {idx !== 0 && (
                    <div className={`hidden md:block absolute top-6 left-[-50%] w-full h-0.5 ${step.completed ? 'bg-primary' : 'bg-gray-100'} -z-10`}></div>
                  )}

                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white mb-0 md:mb-4 relative z-10 shrink-0 ${step.completed ? 'bg-primary text-white shadow-md shadow-blue-100' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon size={20} />
                    {isCurrent && (
                      <span className="absolute -inset-1.5 rounded-full border border-primary animate-ping opacity-20"></span>
                    )}
                  </div>
                  
                  <div className="ml-6 md:ml-0 md:text-center mt-1 md:mt-0">
                    <h3 className={`font-bold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</h3>
                    <p className={`text-xs mt-1 ${step.completed ? 'text-gray-500' : 'text-gray-400'}`}>{step.date}</p>
                    <p className="text-xs text-gray-500 mt-2 hidden md:block px-2">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
