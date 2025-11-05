<?php

namespace Drupal\ofqual_custom_notify\Service;

use GuzzleHttp\ClientInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\key\KeyRepository;
use Drupal\Component\Serialization\Json;

/**
 * Provides a service to send notifications via external API.
 */
class NotificationService
{

  /**
   * The HTTP client.
   *
   * @var \GuzzleHttp\ClientInterface
   */
  protected ClientInterface $httpClient;

  /**
   * The logger channel.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected LoggerChannelInterface $logger;

  /**
   * The key repository.
   *
   * @var \Drupal\key\KeyRepository
   */
  protected KeyRepository $keyRepository;

  /**
   * Constructs the NotificationService.
   *
   * @param \GuzzleHttp\ClientInterface $httpClient
   *   The HTTP client.
   * @param \Drupal\Core\Logger\LoggerChannelFactoryInterface $loggerFactory
   *   The logger factory.
   * @param \Drupal\key\KeyRepository $keyRepository
   *   The key repository.
   */
  public function __construct(
    ClientInterface $httpClient,
    LoggerChannelFactoryInterface $loggerFactory,
    KeyRepository $keyRepository
  ) {
    $this->httpClient = $httpClient;
    $this->logger = $loggerFactory->get('ofqual_custom_notify');
    $this->keyRepository = $keyRepository;
  }

  /**
   * Sends a notification payload to the external API.
   *
   * @param array $notificationPayload
   *   The notification payload.
   *
   * @return bool
   *   TRUE if the notification was sent successfully, FALSE otherwise.
   */
  public function send(array $notificationPayload): bool
  {
    try {
      $apiKeyValue = $this->keyRepository->getKey('ofqual_api_credentials')->getKeyValue();
      if (!$apiKeyValue) {
        $this->logger->error('Key "ofqual_api_credentials" not found.');
        return FALSE;
      }

      $apiCredentials = Json::decode($apiKeyValue);
      $requiredCredentialKeys = [
        'client_id',
        'client_secret',
        'grant_type',
        'scope',
        'token_endpoint',
        'notificationapi',
      ];

      foreach ($requiredCredentialKeys as $credentialKey) {
        if (empty($apiCredentials[$credentialKey])) {
          $this->logger->error('Missing required credential: @key', ['@key' => $credentialKey]);
          return FALSE;
        }
      }

      $accessTokenResponse = $this->httpClient->post($apiCredentials['token_endpoint'], [
        'form_params' => [
          'client_id'     => $apiCredentials['client_id'],
          'client_secret' => $apiCredentials['client_secret'],
          'grant_type'    => $apiCredentials['grant_type'],
          'scope'         => $apiCredentials['scope'],
        ],
      ]);

      $accessTokenData = Json::decode($accessTokenResponse->getBody()->getContents());
      if (empty($accessTokenData['access_token'])) {
        $this->logger->error('Failed to retrieve access token.');
        return FALSE;
      }

      $notificationResponse = $this->httpClient->post($apiCredentials['notificationapi'], [
        'json' => $notificationPayload,
        'timeout' => 10,
        'headers' => [
          'Authorization' => 'Bearer ' . $accessTokenData['access_token'],
          'Accept'        => 'application/json',
          'Content-Type'  => 'application/json',
        ],
      ]);

      $this->logger->notice('Token response received.');
      return $notificationResponse->getStatusCode() === 200;
    } catch (\Exception $exception) {
      $this->logger->error('Notification sending failed: @message', ['@message' => $exception->getMessage()]);
      return FALSE;
    }
  }
}
