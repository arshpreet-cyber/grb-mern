<?php
/**
 * ADD THESE METHODS to StripeController.php on payments.adaired.com
 * Place them before the closing brace of the class.
 *
 * Also add to config/app.php:
 *   'grv_url' => env('GRV_URL', 'https://getreviews.buzz/'),
 *
 * And add to .env:
 *   GRV_URL=https://getreviews.buzz/
 */

/************************************************* GRV (GetReviews Next.js) PAYMENT LOGIC ***********************************************/

public function grv_payment(Request $request)
{
    $orderno      = $request->query('orderno');
    $amount       = (float) $request->query('amount', 0);
    $order_number = $request->query('order_number', $orderno);
    $token_code   = $request->query('tokenCode', '');
    $email        = $request->query('email', '');
    $name         = $request->query('name', 'Customer');
    $return_url   = $request->query('return_url', '');
    $cancel_url   = $request->query('cancel_url', config('app.grv_url') . 'cart');

    if (!$orderno || !$amount) {
        return redirect(config('app.grv_url'));
    }

    try {
        $api = new Api(config('app.razorpay_key'), config('app.razorpay_secret'));

        $description       = "GRV #$order_number";
        $amount_in_paise   = intval(round($amount * 100));

        $rzpOrder = $api->order->create([
            'amount'      => $amount_in_paise,
            'currency'    => 'USD',
            'receipt'     => (string) $order_number,
            'description' => $description,
            'notes'       => [
                'order_number' => $order_number,
                'source'       => 'GRV',
                'description'  => $description,
            ],
        ]);

        // Success URL: Razorpay will append razorpay_payment_id as a query param
        $success_url = url('/grv/success/' . $orderno)
            . '?tokenCode='  . urlencode($token_code)
            . '&return_url=' . urlencode($return_url)
            . '&cancel_url=' . urlencode($cancel_url);

        return view('payments.grv_checkout', [
            'razorpay_key'      => config('app.razorpay_key'),
            'razorpay_order_id' => $rzpOrder->id,
            'amount'            => $amount_in_paise,
            'currency'          => 'USD',
            'description'       => $description,
            'customer_name'     => $name,
            'customer_email'    => $email,
            'customer_contact'  => '+911234567890',
            'success_url'       => $success_url,
            'cancel_url'        => $cancel_url,
            'order_number'      => $order_number,
        ]);

    } catch (Exception $e) {
        return "Razorpay Error: " . $e->getMessage();
    }
}

public function grv_success(Request $request, $id)
{
    $payment_id = $request->query('razorpay_payment_id');
    $return_url = $request->query('return_url', '');
    $cancel_url = $request->query('cancel_url', config('app.grv_url') . 'cart');

    if (!$payment_id || !$return_url) {
        return redirect($cancel_url);
    }

    // return_url is already the Next.js payment-callback URL with orderId + tokenCode.
    // Append the Razorpay payment ID so Next.js can mark the order as paid.
    $separator    = str_contains($return_url, '?') ? '&' : '?';
    $callback_url = $return_url . $separator . 'paymentId=' . urlencode($payment_id);

    return redirect($callback_url);
}

public function grv_cancel(Request $request, $id)
{
    $cancel_url = $request->query('cancel_url', config('app.grv_url') . 'cart');
    return redirect($cancel_url);
}
