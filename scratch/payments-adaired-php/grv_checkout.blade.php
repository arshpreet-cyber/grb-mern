<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Payment – GetReviews</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .card {
            background: #fff;
            border-radius: 16px;
            padding: 44px 40px;
            max-width: 440px;
            width: 92%;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.10);
        }
        .logo-wrap { margin-bottom: 6px; }
        .logo-wrap img { height: 48px; object-fit: contain; }
        .order-label {
            font-size: 13px;
            color: #999;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .amount {
            font-size: 38px;
            font-weight: 800;
            color: #111;
            margin-bottom: 4px;
        }
        .desc {
            font-size: 14px;
            color: #666;
            margin-bottom: 28px;
        }
        .pay-btn {
            background: #FFCE2E;
            color: #111;
            border: none;
            border-radius: 8px;
            padding: 15px 0;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            transition: background 0.2s;
            letter-spacing: 0.3px;
        }
        .pay-btn:hover { background: #EBB81E; }
        .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .secure-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 14px;
            font-size: 12px;
            color: #888;
        }
        .secure-badge svg { flex-shrink: 0; }
        .cancel-link {
            display: block;
            margin-top: 16px;
            font-size: 13px;
            color: #aaa;
            text-decoration: underline;
        }
        .cancel-link:hover { color: #666; }
        .loader {
            display: none;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(0,0,0,0.15);
            border-top-color: #333;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo-wrap">
            <img src="https://grb-mern-gilt.vercel.app/icons/logo.png" alt="GetReviews" />
        </div>

        <p class="order-label">Order #{{ $order_number }}</p>
        <p class="amount">${{ number_format($amount / 100, 2) }}</p>
        <p class="desc">{{ $description }}</p>

        <button id="pay-btn" class="pay-btn">Pay Now</button>
        <div class="loader" id="loader"></div>

        <div class="secure-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Secured by <strong>Razorpay</strong></span>
        </div>

        <a href="{{ $cancel_url }}" class="cancel-link">← Cancel and go back</a>
    </div>

    <script>
        var options = {
            key:         "{{ $razorpay_key }}",
            amount:      {{ $amount }},
            currency:    "{{ $currency }}",
            name:        "GetReviews",
            description: "{{ $description }}",
            order_id:    "{{ $razorpay_order_id }}",
            prefill: {
                name:    "{{ $customer_name }}",
                email:   "{{ $customer_email }}",
                contact: "{{ $customer_contact }}"
            },
            theme: { color: "#FFCE2E" },
            handler: function(response) {
                var btn = document.getElementById('pay-btn');
                var loader = document.getElementById('loader');
                btn.style.display = 'none';
                loader.style.display = 'block';
                // Append razorpay_payment_id to the success URL and redirect
                window.location.href = "{{ $success_url }}" + "&razorpay_payment_id=" + response.razorpay_payment_id;
            },
            modal: {
                ondismiss: function() {
                    // User closed the modal without paying – go back to cart
                    window.location.href = "{{ $cancel_url }}";
                }
            }
        };

        var rzp = new Razorpay(options);

        document.getElementById('pay-btn').addEventListener('click', function(e) {
            e.preventDefault();
            rzp.open();
        });

        // Auto-open the checkout after a short delay so the page renders first
        window.addEventListener('load', function() {
            setTimeout(function() { rzp.open(); }, 600);
        });
    </script>
</body>
</html>
