'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle, Minus, Plus, Tote, WhatsappLogo, X } from '@phosphor-icons/react';
import { contact } from '@/content/site';
import { waHref } from '@/lib/links';
import {
  ORDER_ADDED_EVENT,
  formatAmount,
  orderStore,
  portionName,
  unitPrice,
  useOrder,
  type OrderLine,
} from './order-store';
import styles from './OrderTray.module.css';

type FulfillmentType = 'pickup' | 'delivery';
type Step = 'cart' | 'checkout' | 'confirmed';

interface PlacedOrder {
  /** Null on the published site, which has no order database: the order goes over WhatsApp instead. */
  orderNumber: string | null;
  fulfillmentType: FulfillmentType;
  total: number;
  etaMinutesLabel: string;
  whatsappUrl: string;
}

// 'whatsapp' on the published site (no database there), 'server' on the restaurant's own computer,
// where the order is saved and shows up in the admin dashboard. Set in next.config.ts.
const ORDER_MODE = process.env.NEXT_PUBLIC_ORDER_MODE === 'whatsapp' ? 'whatsapp' : 'server';

interface FormState {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress: string;
}

const EMPTY_FORM: FormState = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  fulfillmentType: 'pickup',
  deliveryAddress: '',
};

function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `key-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function OrderTray() {
  const lines = useOrder();
  const sheet = useRef<HTMLDialogElement>(null);
  const bag = useRef<HTMLButtonElement>(null);
  const [bump, setBump] = useState(0);

  const [step, setStep] = useState<Step>('cart');
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const idempotencyKey = useRef(newIdempotencyKey());

  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const total = useMemo(() => lines.reduce((sum, l) => sum + unitPrice(l) * l.qty, 0), [lines]);

  useEffect(() => {
    if (count === 0 && step === 'cart') sheet.current?.close();
  }, [count, step]);

  // Fly a small copper marker from the pressed button into the tray.
  useEffect(() => {
    const onAdded = (event: Event) => {
      setBump((n) => n + 1);
      const target = bag.current;
      const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail;
      if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      requestAnimationFrame(() => {
        const to = target.getBoundingClientRect();
        const dx = to.left + to.width / 2 - x;
        const dy = to.top + to.height / 2 - y;
        const dot = document.createElement('span');
        dot.className = styles.dot;
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        document.body.appendChild(dot);
        dot
          .animate(
            [
              { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
              { transform: `translate(calc(-50% + ${dx * 0.55}px), calc(-50% + ${dy * 0.2 - 80}px)) scale(1.1)`, opacity: 1, offset: 0.5 },
              { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.4)`, opacity: 0.2 },
            ],
            { duration: 620, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
          )
          .finished.finally(() => dot.remove());
      });
    };
    window.addEventListener(ORDER_ADDED_EVENT, onAdded);
    return () => window.removeEventListener(ORDER_ADDED_EVENT, onAdded);
  }, []);

  function closeAndReset() {
    sheet.current?.close();
    // Only reset the flow once the closing animation would be done; if the customer reopens the
    // tray to review before confirming, they should not lose what they've already typed.
    if (step === 'confirmed') {
      setStep('cart');
      setForm(EMPTY_FORM);
      setPlacedOrder(null);
      setError(null);
      idempotencyKey.current = newIdempotencyKey();
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateClientSide(): string | null {
    if (!form.customerName.trim()) return 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) return 'Please enter a valid email address.';
    if (!/^[+0-9()\s-]{7,20}$/.test(form.customerPhone.trim())) return 'Please enter a valid WhatsApp number.';
    if (form.fulfillmentType === 'delivery' && !form.deliveryAddress.trim()) {
      return 'Please enter your delivery address.';
    }
    return null;
  }

  function whatsappOrderMessage(): string {
    const lineText = lines.map((line) => {
      const portion = portionName(line);
      return `- ${line.name}${portion ? ` (${portion})` : ''} x ${line.qty} = ${formatAmount(unitPrice(line) * line.qty)}`;
    });
    return [
      'Assalam o Alaikum, I would like to place this order with Al Qadri Restaurant:',
      '',
      ...lineText,
      '',
      `Total: ${formatAmount(total)}`,
      '',
      `Name: ${form.customerName.trim()}`,
      `Phone: ${form.customerPhone.trim()}`,
      `Email: ${form.customerEmail.trim()}`,
      '',
      form.fulfillmentType === 'pickup' ? 'Pickup' : `Free Home Delivery: ${form.deliveryAddress.trim()}`,
      'Payment: Cash',
    ].join('\n');
  }

  async function submitOrder() {
    const clientError = validateClientSide();
    if (clientError) {
      setError(clientError);
      return;
    }
    // Published site: no order database, so the finished order opens in WhatsApp, already written out.
    if (ORDER_MODE === 'whatsapp') {
      const url = waHref(whatsappOrderMessage());
      window.open(url, '_blank', 'noopener');
      setPlacedOrder({
        orderNumber: null,
        fulfillmentType: form.fulfillmentType,
        total,
        etaMinutesLabel: 'The restaurant confirms your order and the time on WhatsApp.',
        whatsappUrl: url,
      });
      setStep('confirmed');
      orderStore.clear();
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          customerEmail: form.customerEmail.trim(),
          customerPhone: form.customerPhone.trim(),
          fulfillmentType: form.fulfillmentType,
          deliveryAddress: form.fulfillmentType === 'delivery' ? form.deliveryAddress.trim() : undefined,
          paymentMethod: 'cash',
          items: lines.map((line) => ({ slug: line.slug, portion: line.portion, quantity: line.qty })),
          idempotencyKey: idempotencyKey.current,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { order?: PlacedOrder; error?: string };
      if (!response.ok || !data.order) {
        setError(data.error || 'Your order could not be placed. Please try again.');
        setSubmitting(false);
        return;
      }
      setPlacedOrder(data.order);
      setStep('confirmed');
      orderStore.clear();
      idempotencyKey.current = newIdempotencyKey();
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className={styles.tray} data-visible={count > 0 || undefined} inert={count === 0}>
        <button ref={bag} type="button" className={styles.bar} onClick={() => sheet.current?.showModal()} aria-haspopup="dialog">
          <span className={styles.bagIcon} key={bump} data-bump={bump > 0 || undefined}>
            <Tote aria-hidden="true" />
          </span>
          <span className={styles.barText}>
            <span>Your order</span>
            <span className={styles.count}>
              <span key={count} className={styles.roll}>
                {count}
              </span>{' '}
              {count === 1 ? 'item' : 'items'}
            </span>
          </span>
          <span className={styles.total}>{formatAmount(total)}</span>
          <span className={styles.review}>Review</span>
        </button>
      </div>

      <dialog
        ref={sheet}
        className={styles.sheet}
        aria-labelledby="order-sheet-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeAndReset();
        }}
        onClose={closeAndReset}
      >
        <div className={styles.sheetInner}>
          <div className={styles.sheetHead}>
            <h2 id="order-sheet-title" className={styles.sheetTitle}>
              {step === 'cart' && 'Your order'}
              {step === 'checkout' && 'Checkout'}
              {step === 'confirmed' && 'Order confirmed'}
            </h2>
            <button type="button" className={styles.iconButton} onClick={closeAndReset} aria-label="Close order">
              <X aria-hidden="true" />
            </button>
          </div>

          {step === 'cart' && (
            <CartView
              lines={lines}
              total={total}
              onCheckout={() => {
                setError(null);
                setStep('checkout');
              }}
            />
          )}

          {step === 'checkout' && (
            <CheckoutView
              form={form}
              total={total}
              submitting={submitting}
              error={error}
              onChange={updateField}
              onBack={() => setStep('cart')}
              onSubmit={submitOrder}
            />
          )}

          {step === 'confirmed' && placedOrder && (
            <ConfirmationView order={placedOrder} onClose={closeAndReset} />
          )}
        </div>
      </dialog>
    </>
  );
}

function CartView({
  lines,
  total,
  onCheckout,
}: {
  lines: OrderLine[];
  total: number;
  onCheckout: () => void;
}) {
  return (
    <>
      <ul className={styles.lines}>
        {lines.map((line) => {
          const portion = portionName(line);
          const unit = unitPrice(line);
          return (
            <li key={`${line.slug}-${line.portion}`} className={styles.line}>
              <div className={styles.lineInfo}>
                <span className={styles.lineName}>{line.name}</span>
                <span className="muted">
                  {portion ? `${portion}, ` : ''}
                  {formatAmount(unit)}
                </span>
              </div>
              <div className={styles.stepper} role="group" aria-label={`Quantity of ${line.name}`}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => orderStore.setQty(line.slug, line.portion, line.qty - 1)}
                  aria-label={line.qty === 1 ? `Remove ${line.name}` : `One less ${line.name}`}
                >
                  <Minus aria-hidden="true" />
                </button>
                <span className={styles.qty} aria-live="polite">
                  {line.qty}
                </span>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => orderStore.setQty(line.slug, line.portion, line.qty + 1)}
                  aria-label={`One more ${line.name}`}
                >
                  <Plus aria-hidden="true" />
                </button>
              </div>
              <span className={styles.lineTotal}>{formatAmount(unit * line.qty)}</span>
            </li>
          );
        })}
      </ul>

      <div className={styles.summary}>
        <span>Menu total</span>
        <span className={styles.summaryTotal}>{formatAmount(total)}</span>
      </div>

      <div className={styles.sheetActions}>
        <button type="button" className="btn btn-primary btn-block" onClick={onCheckout} disabled={lines.length === 0}>
          Order now
        </button>
        <a
          className="text-link"
          href={waHref()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsappLogo aria-hidden="true" /> Or ask us a question on WhatsApp {contact.whatsappPhone.display}
        </a>
        <button type="button" className="text-link" onClick={() => orderStore.clear()}>
          Clear order
        </button>
      </div>
    </>
  );
}

function CheckoutView({
  form,
  total,
  submitting,
  error,
  onChange,
  onBack,
  onSubmit,
}: {
  form: FormState;
  total: number;
  submitting: boolean;
  error: string | null;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className={styles.checkout}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className={styles.summary}>
        <span>Menu total</span>
        <span className={styles.summaryTotal}>{formatAmount(total)}</span>
      </div>

      <fieldset className={styles.fulfillment}>
        <legend className="label">Pickup or delivery</legend>
        <div className={styles.fulfillmentOptions}>
          <label className={styles.radioCard} data-checked={form.fulfillmentType === 'pickup' || undefined}>
            <input
              type="radio"
              name="fulfillmentType"
              value="pickup"
              checked={form.fulfillmentType === 'pickup'}
              onChange={() => onChange('fulfillmentType', 'pickup')}
            />
            <span className={styles.radioTitle}>Pickup</span>
            <span className="muted">Collect from the restaurant</span>
          </label>
          <label className={styles.radioCard} data-checked={form.fulfillmentType === 'delivery' || undefined}>
            <input
              type="radio"
              name="fulfillmentType"
              value="delivery"
              checked={form.fulfillmentType === 'delivery'}
              onChange={() => onChange('fulfillmentType', 'delivery')}
            />
            <span className={styles.radioTitle}>Free Home Delivery</span>
            <span className="muted">Delivered to your address</span>
          </label>
        </div>
      </fieldset>

      <label className={styles.field}>
        <span className="label">Name</span>
        <input
          className={styles.input}
          type="text"
          autoComplete="name"
          required
          value={form.customerName}
          onChange={(event) => onChange('customerName', event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className="label">Email</span>
        <input
          className={styles.input}
          type="email"
          autoComplete="email"
          required
          value={form.customerEmail}
          onChange={(event) => onChange('customerEmail', event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className="label">WhatsApp / phone number</span>
        <input
          className={styles.input}
          type="tel"
          autoComplete="tel"
          required
          value={form.customerPhone}
          onChange={(event) => onChange('customerPhone', event.target.value)}
        />
      </label>

      {form.fulfillmentType === 'delivery' && (
        <label className={styles.field}>
          <span className="label">Delivery address</span>
          <textarea
            className={styles.textarea}
            required
            rows={3}
            value={form.deliveryAddress}
            onChange={(event) => onChange('deliveryAddress', event.target.value)}
          />
        </label>
      )}

      <fieldset className={styles.fulfillment}>
        <legend className="label">Payment method</legend>
        <label className={styles.radioCard} data-checked>
          <input type="radio" name="paymentMethod" value="cash" checked readOnly />
          <span className={styles.radioTitle}>Cash</span>
          <span className="muted">
            {form.fulfillmentType === 'pickup' ? 'Pay in cash when you collect your order.' : 'Pay in cash on delivery.'}
          </span>
        </label>
      </fieldset>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.sheetActions}>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
        <button type="button" className="text-link" onClick={onBack} disabled={submitting}>
          Back to cart
        </button>
      </div>
    </form>
  );
}

function ConfirmationView({ order, onClose }: { order: PlacedOrder; onClose: () => void }) {
  return (
    <div className={styles.confirmation}>
      <CheckCircle className={styles.confirmationIcon} weight="fill" aria-hidden="true" />
      <h3>{order.orderNumber ? 'Order Confirmed' : 'Almost there'}</h3>
      <p className="lede">{order.orderNumber ? 'Thank you for your order!' : 'Send your order on WhatsApp to confirm it.'}</p>
      {order.orderNumber && <p className={styles.orderNumber}>Your Order ID: #{order.orderNumber}</p>}
      <p>{order.etaMinutesLabel}</p>
      <p className="muted">Total: {formatAmount(order.total)}</p>
      <div className={styles.sheetActions}>
        <a className="btn btn-primary btn-block" href={order.whatsappUrl} target="_blank" rel="noopener noreferrer">
          <WhatsappLogo aria-hidden="true" /> Send order on WhatsApp
        </a>
        <button type="button" className="btn btn-ghost btn-block" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
