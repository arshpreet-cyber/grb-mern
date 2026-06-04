<?php
/**
 * ADD THESE ROUTES to web.php on payments.adaired.com
 * Place them in the Razorpay routes section alongside the GRB routes.
 */

// GRV (GetReviews Next.js) Routes
Route::get('/grv/payment',      [StripeController::class, 'grv_payment']);
Route::get('/grv/success/{id}', [StripeController::class, 'grv_success']);
Route::get('/grv/cancel/{id}',  [StripeController::class, 'grv_cancel']);
